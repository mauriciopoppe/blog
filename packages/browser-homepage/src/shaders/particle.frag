precision lowp float;

#pragma glslify: noise = require(glsl-noise/simplex/2d)

varying vec3 fragColor;
void main() {
  if (length(gl_PointCoord.xy - 0.5) > 0.5) {
    discard;
  }

  float brightness = noise(gl_PointCoord.xy);
  gl_FragColor = vec4(vec3(fragColor), 1);
}
