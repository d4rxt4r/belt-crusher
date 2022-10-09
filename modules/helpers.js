const returnBodyIfCollides = (collider, pair, collidesWith) => {
    let collisionChecks = collidesWith;

    if (!Array.isArray(collidesWith)) {
        collisionChecks = [collidesWith];
    }

    if (pair.bodyB === collider && collisionChecks.includes(pair.bodyA.label)) {
        return pair.bodyA;
    }

    if (pair.bodyA === collider && collisionChecks.includes(pair.bodyB.label)) {
        return pair.bodyB;
    }

    return null;
};

export { returnBodyIfCollides };
