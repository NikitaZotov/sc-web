// SCgLayoutNode class
// Methods for Separation, Cohesion, Alignment added

function SCgLayoutNode(object) {
    this.random = (a, b) => {
        return Math.random() * 10 % 2 ? a : b;
    };

    this.object = object;
    this.acceleration = new SCg.Vector3(0, 0, 0);
    this.velocity = new SCg.Vector3(this.random(-1, 1), this.random(-1, 1), this.random(-1, 1));
    // this.r = 3.0;
    this.position = object.position;
    this.maxspeed = 3;    // Maximum speed
    this.maxforce = 0.05; // Maximum steering force
}

SCgLayoutNode.prototype.run = function(nodes) {
    this.flock(nodes);
    this.update();
    this.borders();
}

SCgLayoutNode.prototype.applyForce = function(force) {
    // We could add mass here if we want A = F / M
    this.acceleration.add(force);
}

// We accumulate a new acceleration each time based on three rules
SCgLayoutNode.prototype.flock = function(nodes) {
    let sep = this.separate(nodes);   // Separation
    console.log('sep', sep);
    let ali = this.align(nodes);      // Alignment
    console.log('ali', ali);
    let coh = this.cohesion(nodes);   // Cohesion
    console.log('coh', coh);
    // Arbitrarily weight these forces
    sep.multiplyScalar(1.5);
    ali.multiplyScalar(1.0);
    coh.multiplyScalar(1.0);
    // Add the force vectors to acceleration
    this.applyForce(sep);
    this.applyForce(ali);
    this.applyForce(coh);
}

// Method to update location
SCgLayoutNode.prototype.update = function() {
    // Update velocity
    this.velocity.add(this.acceleration);
    // Limit speed
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
    // Reset acceleration to 0 each cycle
    this.acceleration.multiplyScalar(0);
}

// A method that calculates and applies a steering force towards a target
// STEER = DESIRED MINUS VELOCITY
SCgLayoutNode.prototype.seek = function(target) {
    let desired = target.subProduct(this.position);  // A vector pointing from the location to the target
    // Normalize desired and scale to maximum speed
    desired.normalize();
    desired.multiplyScalar(this.maxspeed);
    // Steering = Desired minus Velocity
    let steer = desired.subProduct(this.velocity);
    steer.limit(this.maxforce);  // Limit to maximum steering force
    return steer;
}

// Wraparound
SCgLayoutNode.prototype.borders = function() {
    // if (this.position.x < -this.r) this.position.x = width + this.r;
    // if (this.position.y < -this.r) this.position.y = height + this.r;
    // if (this.position.x > width + this.r) this.position.x = -this.r;
    // if (this.position.y > height + this.r) this.position.y = -this.r;
}

// Separation
// Method checks for nearby nodes and steers away
SCgLayoutNode.prototype.separate = function(nodes) {
    let desiredSeparation = 25.0;
    let steer = new SCg.Vector3(0, 0, 0);
    let count = 0;
    // For every node in the system, check if it's too close
    for (let i = 0; i < nodes.length; i++) {
        let d = this.position.distance(nodes[i].position);
        // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
        if ((d > 0) && (d < desiredSeparation)) {
            // Calculate vector pointing away from neighbor
            let diff = this.position.subProduct(nodes[i].position);
            diff.normalize();
            diff.divideScalar(d);        // Weight by distance
            steer.add(diff);
            count++;            // Keep track of how many
        }
    }
    // Average -- divide by how many
    if (count > 0) {
        steer.divideScalar(count);
    }

    // As long as the vector is greater than 0
    if (steer.length() > 0) {
        // Implement Reynolds: Steering = Desired - Velocity
        steer.normalize();
        steer.multiplyScalar(this.maxspeed);
        steer.sub(this.velocity);
        steer.limit(this.maxforce);
    }
    return steer;
}

// Alignment
// For every nearby node in the system, calculate the average velocity
SCgLayoutNode.prototype.align = function(nodes) {
    let neighborDist = 50;
    let sum = new SCg.Vector3(0, 0, 0);
    let count = 0;
    for (let i = 0; i < nodes.length; i++) {
        let d = this.position.distance(nodes[i].position);
        if ((d > 0) && (d < neighborDist)) {
            sum.add(nodes[i].velocity);
            count++;
        }
    }
    if (count > 0) {
        sum.divideScalar(count);
        sum.normalize();
        sum.multiplyScalar(this.maxspeed);
        let steer = sum.subProduct(this.velocity);
        steer.limit(this.maxforce);
        return steer;
    } else {
        return new SCg.Vector3(0, 0, 0);
    }
}

// Cohesion
// For the average location (i.e. center) of all nearby nodes, calculate steering vector towards that location
SCgLayoutNode.prototype.cohesion = function(nodes) {
    let neighborDist = 50;
    let sum = new SCg.Vector3(0, 0, 0);   // Start with empty vector to accumulate all locations
    let count = 0;
    for (let i = 0; i < nodes.length; i++) {
        let d = this.position.distance(nodes[i].position);
        if ((d > 0) && (d < neighborDist)) {
            sum.add(nodes[i].position); // Add location
            count++;
        }
    }
    if (count > 0) {
        sum.divideScalar(count);
        return this.seek(sum);  // Steer towards the location
    } else {
        return new SCg.Vector3(0, 0, 0);
    }
}

// ------------------------------------

SCg.LayoutManager = function () {

};

SCg.LayoutManager.prototype = {
    constructor: SCg.LayoutManager
};

SCg.LayoutManager.prototype.init = function (scene) {
    this.scene = scene;
    this.nodes = null;
    this.edges = null;

    this.algorithm = null;
};

/**
 * Prepare objects for layout
 */
SCg.LayoutManager.prototype.prepareObjects = function (sceneNodes) {
    this.nodes = {};
    this.edges = {};

    this.nodes[0] = [];
    this.edges[0] = [];

    const appendElement = (element, elements) => {
        const contour = element.contour ? element.contour.sc_addr : 0;
        if (!elements[contour]) {
            elements[contour] = [];
        }

        elements[contour].push(new SCgLayoutNode(element));
    }

    // first of all we need to collect objects from scene, and build them representation for layout
    for (let idx in sceneNodes) {
        const node = sceneNodes[idx];
        appendElement(node, this.nodes);
    }
};

/**
 * Starts layout in scene
 */
SCg.LayoutManager.prototype.doLayout = function () {
    this.prepareObjects(this.scene.nodes);
    for (let j = 0; j < 1; j++) {
        for (let i = 0; i < this.nodes[0].length; i++) {
            this.nodes[0][i].run(this.nodes[0]);  // Passing the entire list of nodes to each node individually
            this.onTickUpdate(this.nodes[0]);
        }
    }
};

SCg.LayoutManager.prototype.onTickUpdate = function (nodes) {
    this.scene.render.updateNodes(nodes.map(node => node.object));
    this.scene.pointed_object = null;
};
