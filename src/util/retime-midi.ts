import fs from 'fs'

const inputPath = process.argv[2]
const outputPath = process.argv[3]
const sourceBpm = Number(process.argv[4])
const targetBpm = Number(process.argv[5])

if (!inputPath || !outputPath || !sourceBpm || !targetBpm) {
  throw new Error('Usage: bun run src/util/retime-midi.ts input.mid output.mid sourceBpm targetBpm')
}

function readVlq(data: Buffer, offset: number) {
  let value = 0
  let byte = 0
  do {
    byte = data[offset++]
    value = (value << 7) | (byte & 0x7f)
  } while (byte & 0x80)
  return { value, next: offset }
}

function writeVlq(value: number) {
  const bytes = [value & 0x7f]
  while ((value >>= 7)) bytes.unshift((value & 0x7f) | 0x80)
  return Buffer.from(bytes)
}

function retimeTrack(track: Buffer, scale: number, targetTempo: number) {
  const events: Array<{ tick: number, bytes: Buffer }> = []
  let offset = 0
  let tick = 0
  let runningStatus = 0
  let replacedTempo = false

  while (offset < track.length) {
    const delta = readVlq(track, offset)
    tick += delta.value
    offset = delta.next
    const first = track[offset++]
    const status = first < 0x80 ? runningStatus : first
    if (first < 0x80) offset--

    if (status === 0xff) {
      const type = track[offset++]
      const size = readVlq(track, offset)
      offset = size.next
      let payload = track.subarray(offset, offset + size.value)
      offset += size.value
      if (type === 0x51 && payload.length >= 3 && !replacedTempo) {
        const microseconds = Math.round(60000000 / targetBpm)
        payload = Buffer.from([(microseconds >> 16) & 0xff, (microseconds >> 8) & 0xff, microseconds & 0xff])
        replacedTempo = true
      }
      events.push({ tick, bytes: Buffer.concat([Buffer.from([0xff, type]), writeVlq(payload.length), payload]) })
      continue
    }

    if (status === 0xf0 || status === 0xf7) {
      const size = readVlq(track, offset)
      offset = size.next
      const payload = track.subarray(offset, offset + size.value)
      offset += size.value
      events.push({ tick, bytes: Buffer.concat([Buffer.from([status]), writeVlq(payload.length), payload]) })
      continue
    }

    runningStatus = status
    const command = status & 0xf0
    const dataLength = command === 0xc0 || command === 0xd0 ? 1 : 2
    const payload = track.subarray(offset, offset + dataLength)
    offset += dataLength
    events.push({ tick, bytes: Buffer.concat([Buffer.from([status]), payload]) })
  }

  let previousTick = 0
  const output: Buffer[] = []
  events.forEach((event) => {
    const scaledTick = Math.round(event.tick * scale)
    output.push(writeVlq(scaledTick - previousTick), event.bytes)
    previousTick = scaledTick
  })
  return Buffer.concat(output)
}

const input = fs.readFileSync(inputPath)
const trackCount = input.readUInt16BE(10)
const scale = targetBpm / sourceBpm
let offset = 14
const chunks: Buffer[] = [input.subarray(0, 14)]

for (let trackIndex = 0; trackIndex < trackCount; trackIndex++) {
  const length = input.readUInt32BE(offset + 4)
  const trackStart = offset + 8
  const track = input.subarray(trackStart, trackStart + length)
  const retimed = retimeTrack(track, scale, targetBpm)
  const header = Buffer.alloc(8)
  input.copy(header, 0, offset, offset + 4)
  header.writeUInt32BE(retimed.length, 4)
  chunks.push(header, retimed)
  offset = trackStart + length
}

fs.writeFileSync(outputPath, Buffer.concat(chunks))
