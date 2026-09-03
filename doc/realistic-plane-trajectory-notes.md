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

## Current scope

The stable baseline has pitch and yaw control through forces at the tail. Future steps can add a coordinated aileron model, atmospheric wind, and a rope attached to the tail after extending the aerodynamic model and its deterministic tests.
