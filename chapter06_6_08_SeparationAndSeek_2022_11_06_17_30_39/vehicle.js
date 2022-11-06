class Vehicle {
  constructor(x, y) {
    this.location = createVector(x, y);
    this.r = 22;
    this.maxspeed = 3; // Maximum speed
    this.maxforce = 0.01; // Максимальное усилие на руле (steering force)
    this.acceleration = createVector(0, 0);
    this.velocity = createVector(0, 0);
  }

  applyForce(force) {
    // We could add mass here if we want A = F / M
    this.acceleration.add(force);
  }

  applyBehaviors(vehicles = []) {
    let separateForce = this.separate(vehicles);
    let seekForce = this.seek(new p5.Vector(mouseX, mouseY));
    separateForce.mult(2);
    seekForce.mult(1);
    this.applyForce(separateForce);
    this.applyForce(seekForce);
  }

  // A method that calculates a steering force towards a target
  // STEER = DESIRED MINUS VELOCITY
  // Метод, вычисляющий направляющую силу к цели
  // РУЛЕВОЕ УПРАВЛЕНИЕ = ЖЕЛАЕМАЯ МИНУС СКОРОСТЬ
  seek(target = createVector(0, 0)) {
    // Вектор, указывающий от местоположения к цели
    let desired = new p5.Vector.sub(target, this.location); // A vector pointing from the location to the target

    // Normalize desired and scale to maximum speed
    // Нормализуем желаемое и масштабируем до максимальной скорости
    desired.normalize();
    desired.mult(this.maxspeed);
    // Steering = Desired minus velocity
    // Рулевое управление = желаемая минус скорость
    let steer = p5.Vector.sub(desired, this.velocity);
    // Ограничение максимального усилия на рулевом колесе
    steer.limit(this.maxforce); // Limit to maximum steering force

    return steer;
  }

  // Separation
  // Method checks for nearby vehicles and steers away
  // Метод проверяет близлежащие vehicles и отклоняется
  separate(vehicles = []) {
    let desiredseparation = this.r * 3;
    let sum = createVector(0, 0);
    let count = 0;

    // For every boid in the system, check if it's too close
    for (let i = 0; i < vehicles.length; i++) {
      let other = vehicles[i];

      let d = p5.Vector.dist(this.location, other.location);

      // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
      // Если расстояние больше 0 и меньше произвольной величины (0, когда вы сами)
      if (d > 0 && d < desiredseparation) {
        // Calculate vector pointing away from neighbor
        // Вычислить вектор, направленный от соседа
        let diff = p5.Vector.sub(this.location, other.location);

        diff.normalize();
        diff.div(d); // Weight by distance // Вес по расстоянию
        sum.add(diff);
        count++; // Keep track of how many // Следим за количеством
      }
    }
    // Average -- divide by how many
    // Среднее -- делим на сколько
    if (count > 0) {
      sum.div(count);
      // Our desired vector is the average scaled to maximum speed
      // Наш желаемый вектор - это среднее, масштабированное до максимальной скорости
      sum.normalize();
      sum.mult(this.maxspeed);
      // Implement    Reynolds: Steering = Desired - Velocity
      // Реализовать Reynolds: Steering = Desired - Velocity
      sum.sub(this.velocity);
      sum.limit(this.maxforce);
    }
    return sum;
  }

  // Method to update location
  update() {
    // Update velocity
    this.velocity.add(this.acceleration);
    // Limit speed
    this.velocity.limit(this.maxspeed);
    this.location.add(this.velocity);
    // Reset accelertion to 0 each cycle
    // Сбрасываем ускорение на 0 каждый цикл
    this.acceleration.mult(0);
  }

  display() {
    //    console.log(this.velocity.x);
    fill(
      map(this.velocity.x, -this.maxspeed, this.maxspeed, 0, 255),
      map(this.velocity.y, -this.maxspeed, this.maxspeed, 0, 255),
      map(
        this.velocity.x + this.velocity.y,
        -this.maxspeed * 2,
        this.maxspeed * 2,
        0,
        255
      )
    );
    stroke(255);
    push();
    translate(this.location.x, this.location.y);
    ellipse(0, 0, this.r * this.velocity.x, this.r * this.velocity.y);
    pop();
  }
}
