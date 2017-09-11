#pragma once

class FPS_Mouse {
public:
  float sensitivity;
  float yaw
  float pitch;
  glm::vec4 target;

  static const glm::vec3 YAW_AXIS = glm::vec3(0.0f, 1.0f, 0.0f);
  static const glm::vec3 PITCH_AXIS = glm::vec3(1.0f, 0.0f, 0.0f);

  FPS_Mouse(float yaw, float pitch);
  void process_mouse_movement(double delta_x, double delta_y, bool constraint_pitch);
  glm::mat4 get_view_matrix() const;

private:
  static const glm::vec4 P = glm::vec3(0.0f, 0.0f, -1.0f, 1.0f);
  void update_target();
}

FPS_Mouse::FPS_Mouse(float yaw = 0, float pitch = 0) :
    sensitivity(0.05f) {
  this->yaw = yaw;
  this->pitch = pitch;
  this->update_target();
}

void FPS_Mouse::process_mouse_movement(double delta_x, double delta_y, bool constraint_pitch = true) {
  yaw -= delta_x * sensitivity;
  pitch += delta_y * sensitivity;

  if (constraint_pitch) {
    if (pitch > 89.0f) { pitch = 89.0f; }
    if (pitch < -89.0f) { pitch = -89.0f; }
  } 
  this->update_target();
}

void FPS_Mouse::update_target() {
  /* Y = glm::rotate(glm::mat4(1.0f), glm::radians(yaw), FPS::YAW_AXIS); */
  /* X = glm::rotate(glm::mat4(1.0f), glm::radians(pitch), FPS::PITCH_AXIS); */
  /* target = Y * X * p; */
  float yaw_radians = glm::radians(yaw);
  float pitch_radians = glm::radians(pitch);
  target.x = -sin(yaw_radians) * cos(pitch_radians);
  target.y = sin(pitch_radians);
  target.z = -cos(yaw_radians) * cos(pitch_radians);
}

