# Realistic Plane Trajectory Notes

Working notes for a future article about building a believable plane trajectory with Three.js and cannon-es.

## First physical world

The first useful scene was deliberately small:

- A cannon-es world with gentle downward gravity.
- A rigid plane body with an aircraft-shaped box inertia tensor.
- Constant thrust applied along the body's local nose axis.
- A Three.js renderer that copies only the body's position and quaternion.

This established the baseline flight path. The plane moved forward and descended under gravity without any direct position transform in the renderer.

## Adding lift

We then added lift as a separate force. Lift is perpendicular to the plane's velocity and its wing span. With attitude locked, this isolated how airspeed affects vertical force without introducing steering or control torques.

## Reaching a stable cruise speed

Constant thrust made the plane accelerate indefinitely. We tuned the small scene's force scale with:

- Gravity: `-0.45` scene units.
- Thrust: `2.5` along the nose.
- Lift: `min(2, 0.14 * airspeed²)`.
- Quadratic drag: `-0.25 * velocity * |velocity|`.

Quadratic drag gives the plane a finite terminal speed. At that speed, lift can balance the scaled gravity without requiring a fast animation.

## Speed control milestone

The fixed-thrust model was replaced with a bounded throttle controller. It raises thrust below the target airspeed and lowers it above that speed. The controller is shared between the Cannon scene and deterministic tests.

This establishes a stable airspeed target. The plane can still climb because lift currently depends only on airspeed. Altitude hold requires the next layer: a bounded pitch controller that adjusts angle of attack and therefore lift.

## Angle of attack: passive model before active trim

Lift now uses angle of attack, defined as the difference between the plane's pitch and its flight-path angle. This gives a useful passive response: climbing reduces effective lift, while descending increases it.

An initial pitch-trim controller attempted to correct vertical speed with torque around the wing axis. It could drive the rigid body through a full inversion and stall it backward. The lesson is that vertical-speed feedback alone is not a stable aerodynamic pitching moment.

For now, the plane's attitude remains locked and the passive lift model stays enabled. A future active controller needs a proper pitch-moment model, bounded control-surface authority, and tests that cover inversion and stall recovery before it can apply torque to the body.

## Rigid body and control surfaces

The next version unlocked angular motion and represented the aircraft as a Cannon rigid body. The physics body has two collision volumes:

- A fuselage box for the body mass and longitudinal inertia.
- A thin wing box that adds the roll inertia of the wings without changing the visual mesh.

Every force has an explicit location:

- Thrust, drag, and gravity act through the center of mass.
- Lift is split between the left and right wing locations.
- Rudder force acts laterally at the tail. Outside the flight sphere, it points the plane back toward the sphere center and damps yaw rate.
- Elevator force acts vertically at the tail. It trims altitude, damps pitch rate, and restores level pitch.

The renderer only copies the body position and quaternion. It never changes the plane transform to steer it.

## Stable return controller

The return behavior is deliberately modest. After the plane crosses the flight sphere outbound, the tail rudder turns it toward the center. The elevator and passive lift model keep its altitude and pitch bounded during the turn.

The present rigid-body model does not yet include enough aerodynamic detail for a stable coordinated bank. Aileron authority is therefore set to zero in the default controller. The aileron force model and its unit tests remain available for a future aerodynamic model with wing-side slip and a more complete roll moment.

## Deterministic Cannon verification

The controller is verified without the renderer. A local copy of Cannon runs the same rigid body, 60 Hz fixed step, startup force ramp, force locations, and flight-envelope checks as the scene.

The regression test asserts the observable behavior in order:

1. The plane crosses the sphere outbound.
2. The tail-driven controller returns it across the sphere inbound.
3. Neither pitch, roll, nor angular-speed envelope trips during the sequence.

This test turned controller tuning into a fast feedback loop. It also exposed two problems that screenshots obscured: force points passed in the wrong coordinate frame create artificial torque, and a body without wing inertia rolls far too quickly under wing forces.

## Rendering the physical model

The sandbox can render the fuselage and wing collision volumes as wireframes, together with labels for force vectors. Vector origins are updated from the same post-step Cannon pose as the rigid body. Updating the vectors before the physics step and the body after it produced a fast two-position ghost image.

## Faster return to the flight sphere

Return time became a second deterministic metric. The test measures the elapsed simulation time between the outbound crossing and the following inbound crossing while still requiring a safe flight envelope.

The original tail-rudder controller returned in `108.37` seconds. We changed one force parameter at a time and kept every other force location unchanged:

- Increasing rudder gain from `0.035` to `0.1` reduced the time to `41.33` seconds.
- A gain of `0.3` reached `20.88` seconds.
- Higher gain eventually exceeded the angular-speed envelope.
- Increasing yaw damping from `0.35` to `0.5` allowed a stronger `0.65` rudder gain without that rate failure.

The final controller returns in under `15` seconds. The tail rudder remains the only turn command. Thrust still follows the airspeed controller, so it was not changed during this optimization. This leaves a useful next experiment: reduce throttle during the return and evaluate turn radius, lift, angle of attack, and recovery together.

## Coordinated bank and level roll recovery

A rudder-only turn rotates the fuselage flat across the horizon without tilting the lift vector. Real turns require bank so that a component of lift provides the inward centripetal acceleration.

Applying ailerons exposed a reference-frame flaw in the early roll measurement. That calculation evaluated roll against world X (`atan2(up.x, up.y)`). This works only while the aircraft faces world +Z. Once the rudder turns the nose toward world X or -Z, the projection distorts and ailerons fight ghost roll angles.

The replacement function `calculateLevelRoll({ forward, up })` measures bank directly around the aircraft's current forward axis. It projects world +Y onto the plane perpendicular to `forward` to produce `levelUp`:

$$
\mathbf{u}_{\text{level}} = \text{normalize}(\mathbf{y}_{\text{world}} - (\mathbf{y}_{\text{world}} \cdot \mathbf{f})\mathbf{f})
$$

Signed bank is then computed from the cross and dot products against `levelUp`:

$$
\phi = \text{atan2}((\mathbf{u}_{\text{level}} \times \mathbf{u}) \cdot \mathbf{f}, \, \mathbf{u}_{\text{level}} \cdot \mathbf{u})
$$

This formulation gives an accurate bank angle at any compass heading.

## Two-mode flight control

Aileron control has two distinct goals depending on trajectory phase:

1. `returning`: When the aircraft is outside the flight sphere and facing outward, a gentle bank (`maxBankAngle: 0.08`, `rollGain: 0.01`, `rollDamping: 0.03`, `maxAileronForce: 0.001`) tilts lift into the turn alongside the tail rudder (`rudderGain: 0.2`, `maxYawRate: 0.6`).
2. `normal`: Once the aircraft aims inward or re-enters the boundary, commanded yaw drops to zero. Ailerons switch to leveling mode (`normalRollGain: 0.05`, `normalRollDamping: 0.1`, `normalMaxAileronForce: 0.02`), applying restoring forces to align the aircraft normal with world +Y.

The transition is decided by `calculateFlightMode()`. Rather than waiting for the aircraft to cross back inside the physical radius, the controller switches to `normal` as soon as its horizontal heading aligns inward (`normalEntryHeading: 0.8`). This allows the wings to level out before the aircraft re-enters the sphere.

Deterministic tests verify that the aircraft completes outbound and inbound boundary crossings within 30 seconds while keeping normal alignment above `0.9`, forward speed above `1.0`, and pitch and roll within envelope limits across 60 Hz, 30 Hz, and 15 Hz steps.

## Half-loop and roll return (Immelmann turn)

An alternative return strategy (`returnStrategy: 'half-loop'`) executes an Immelmann turn when reaching the flight boundary. The maneuver consists of two sequential phases:

1. `returning-loop`: The elevator applies a downward tail force (`loopElevatorForce: -0.35`, with pitch-rate damping tracking `loopTargetPitchRate: -0.8 rad/s`) while thrust ramps to `4.0 N` and lift authority expands (`loopMaxLift: 6.0 N`). The aircraft climbs through a vertical half-loop. Angle of attack during vertical and inverted flight is computed in the body coordinate frame:
$$
\alpha = \text{atan2}(-\mathbf{v} \cdot \mathbf{u}, \, \mathbf{v} \cdot \mathbf{f})
$$
Once the horizontal heading points back toward the boundary center (`headingDot > 0.65`), pitch attitude approaches inverted horizontal (`|forward.y| < 0.25`), and the body up vector faces downward (`up.y < -0.4`), the phase transitions to `returning-roll`.

2. `returning-roll`: The aircraft performs a half roll (180 degrees) around its forward axis to restore an upright attitude. Ailerons drive roll rate (`halfRollTargetRate: 2.5 rad/s`, `halfRollMaxAileronForce: 5.0 N`) until the upper hemisphere is reached, where a proportional-derivative controller stabilizes the wings level. The elevator actively arrests residual pitch climb (`halfRollMaxElevatorForce: 0.35 N`) and the rudder damps yaw. Once the aircraft is upright (`up.y > 0.85`), wings are level (`|currentRoll| < 0.15`), roll rate is settled (`|rollRate| < 0.15 rad/s`), and angular speed is calm (`angularSpeed < 0.65 rad/s`), the controller hands over to `normal` cruise flight.

During the aerobatic phases, `evaluateFlightEnvelope` bypasses cruise pitch and roll caps while bounding total angular velocity (`maxAerobaticAngularSpeed: 8.0 rad/s`). Cannon physics simulation confirms that the maneuver completes an outbound and inbound boundary cycle within 11 seconds with zero envelope violations.

## Knife-edge break turn

A third return strategy (`returnStrategy: 'knife-edge'`) executes a graceful 63-degree knife-edge slice turn at the flight boundary without altitude loss or violent angular transients. The maneuver consists of three sequential phases:

1. `returning-knife-roll`: The aircraft rolls smoothly around its forward axis toward a 63-degree bank angle ($\phi = \pm 1.10 \text{ rad}$). The roll direction is determined dynamically from the heading cross product with the boundary center vector (`yaw >= 0 ? -1 : 1`), picking the shortest angular turn. Smooth rate-bounded aileron forces (`knifeRollTargetRate: 0.7 rad/s`, `knifeMaxAileronForce: 1.0 N`) prevent snap-roll overshoot. Once the bank angle reaches orientation (`|currentRoll - targetBank| < 0.25 rad`), the phase transitions to `returning-knife-turn`.

2. `returning-knife-turn`: The aircraft holds its 63-degree bank while the elevator pulls a moderate pitch-up moment (`knifeTurnElevatorForce: -0.09 N`, damping toward `knifeTurnTargetPitchRate: -0.32 rad/s`). Primary wing lift rotates into the horizontal plane with standard cruise limits (`knifeTurnMaxLift: 3.6 N`), executing a steady 7-second turn across the horizon without extreme G-forces. The vertical stabilizer applies pure yaw damping (`calculateRudderForce({ yawCommand: 0, yawRate })`) to prevent body yaw spin. Once the horizontal heading aligns back toward the sphere center (`headingDot > 0.65`), the phase transitions to `returning-knife-level`.

3. `returning-knife-level`: Ailerons drive the bank angle back to wings-level ($\phi \to 0$) while the elevator stabilizes pitch attitude (`elevatorForce = pitchAngle * 1.5 - pitchRate * 0.6`, clamped to `0.35 N`) to prevent climbing overshoot. Once the aircraft is upright (`up.y > 0.85`), wings are level (`|currentRoll| < 0.15`), and angular velocities are calmed (`|rollRate| < 0.15 rad/s`, `|pitchRate| < 0.35 rad/s`, `angularSpeed < 0.50 rad/s`), the controller transfers authority to `normal` flight if heading is aligned (`headingDot >= 0.65`) or `returning` mode if gentle heading refinement is needed.

During all knife-edge phases, `evaluateFlightEnvelope` permits full pitch and roll excursions while protecting total angular velocity (`maxAerobaticAngularSpeed: 8.0 rad/s`). Cannon physics simulation verifies that the aircraft never drops below 1.6 units from cruise altitude and completes inbound return within 22 seconds with zero envelope violations.

## Independent particle rope streamers

A system of independent particle ropes trails from the aircraft tail, behaving like fabric streamers in the wind, with two swappable simulation backends:

1. **Custom Verlet integrator (`engine: 'verlet'`)**:
   - 7 independent ropes distributed horizontally across the empennage ($w = 0.35\text{ m}$).
   - 20 point particles per rope connected by unilateral distance constraints ($L_0 = 0.18\text{ m}$, total length $\approx 3.6\text{ m}$).
   - Distance constraints enforce tension only (`if (dist > restLength)`), allowing natural slacking and folding under compression.
   - Anisotropic aerodynamic crossflow drag decomposes velocity into tangential ($v_{\parallel}$) and perpendicular crossflow ($v_{\perp}$) components. Heavy crossflow damping (`crossflowDamping: 0.35`) holds particles in the wake during turns, creating sweeping $> 15\text{ cm}$ arcs.
   - Pinned kinematically to aircraft tail via quaternion transform, creating zero reaction load on the plane.

2. **Native Cannon physics engine (`engine: 'cannon'`)**:
   - Models each rope using native `CANNON.Body` instances and `CANNON.DistanceConstraint`.
   - Head particle uses `CANNON.Body.KINEMATIC` (mass 0) pinned to the tail, pulling subsequent dynamic bodies through native solver equations without transmitting reaction forces back to `planeBody`.
   - All free particles have uniform mass (`0.005 kg`) with `linearDamping: 0.20`.
   - Stepped directly by `physicsWorld.step()`.

3. **Visual rendering & runtime switching**:
   - Each streamer is rendered as a distinct dynamic `THREE.Line` with a warm sunset palette (`0xff7043`, `0xff9800`, `0xffca28`, `0xffd54f`, `0xffab91`, `0xff6e40`, `0xf43f5e`).
   - The debug GUI provides runtime switching between engines via the `Streamer engine` dropdown (`'cannon'` vs `'verlet'`) and live tuning via the `Solver iterations` slider.





## Current scope

The baseline has pitch, yaw, coordinated roll, aerobatic half-loop (Immelmann turn), knife-edge break turn maneuvers, and independent particle rope streamers. Rendering switches between cosmetic models and rigid-body debug collision meshes via the `isProduction` flag (`process.env.NODE_ENV === 'production'`, `window.__SUNSET_PROD__`, or `?debug=1` query parameter). Future steps can add atmospheric wind gusts and throttle variation during banked turns.

