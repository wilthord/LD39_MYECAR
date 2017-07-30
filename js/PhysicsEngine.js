// These are global shorthands we declare for Box2D primitives
// we'll be using very frequently.
Vec2 = b2Vec2;
BodyDef = b2BodyDef;
Body = b2Body;
FixtureDef = b2FixtureDef;
Fixture = b2Fixture;
World = b2World;
MassData = b2MassData;
PolygonShape = b2PolygonShape;
CircleShape = b2CircleShape;
DebugDraw = b2DebugDraw;
RevoluteJointDef = b2RevoluteJointDef;

PhysicsEngineClass = function() {
    this.world = null;

    this.PHYSICS_LOOP_HZ = 1.0 / 60.0;
}

PhysicsEngineClass.prototype.constructor = PhysicsEngineClass;

PhysicsEngineClass.prototype.create = function() {
    this.world = new World(
        new Vec2(0, 0), // Gravity vector
        false // Don't allow sleep
    );

    /*
        var debugDraw = new b2DebugDraw();
        debugDraw.SetSprite(GE.ctx);
        debugDraw.SetDrawScale(1.0);
        debugDraw.SetFillAlpha(0);
        debugDraw.SetLineThickness(5.0);
        debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
        this.world.SetDebugDraw(debugDraw);*/
}

//-----------------------------------------
PhysicsEngineClass.prototype.update = function() {
    var start = Date.now();

    this.world.Step(
        this.PHYSICS_LOOP_HZ, //frame-rate
        10, //velocity iterations
        10 //position iterations
    );
    this.world.ClearForces();

    return (Date.now() - start);
}

//-----------------------------------------
PhysicsEngineClass.prototype.addContactListener = function(callbacks) {
    var listener = new b2ContactListener();

    if (callbacks.BeginContact) listener.BeginContact = function(contact) {
        callbacks.BeginContact(contact.GetFixtureA().GetBody(),
            contact.GetFixtureB().GetBody());
    };

    if (callbacks.EndContact) listener.EndContact = function(contact) {
        callbacks.EndContact(contact.GetFixtureA().GetBody(),
            contact.GetFixtureB().GetBody());
    };

    this.world.SetContactListener(listener);
}

//-----------------------------------------
PhysicsEngineClass.prototype.registerBody = function(bodyDef) {
    var body = this.world.CreateBody(bodyDef);
    return body;
}

//-----------------------------------------
PhysicsEngineClass.prototype.addBody = function(entityDef) {
    var bodyDef = new BodyDef();

    var id = entityDef.id;

    if (entityDef.type == 'static') {
        bodyDef.type = Body.b2_staticBody;
    } else {
        bodyDef.type = Body.b2_dynamicBody;
    }

    bodyDef.position.x = entityDef.x;
    bodyDef.position.y = entityDef.y;

    if (entityDef.userData) bodyDef.userData = entityDef.userData;

    var body = this.registerBody(bodyDef);
    var fixtureDefinition = new FixtureDef();

    if (entityDef.useBouncyFixture) {
        fixtureDefinition.density = 1.0;
        fixtureDefinition.friction = 0;
        fixtureDefinition.restitution = 1.0;
    }

    if (entityDef.filterGroupIndex) fixtureDefinition.filter.groupIndex = entityDef.filterGroupIndex;

    // Now we define the shape of this object as a box
    fixtureDefinition.shape = new PolygonShape();
    fixtureDefinition.shape.SetAsBox(entityDef.halfWidth, entityDef.halfHeight);
    if (entityDef.isSensor) fixtureDefinition.isSensor = entityDef.isSensor;
    body.CreateFixture(fixtureDefinition);

    return body;
}

//-----------------------------------------
PhysicsEngineClass.prototype.removeBody = function(obj) {
    this.world.DestroyBody(obj);
}


var gPhysicsEngine = new PhysicsEngineClass();