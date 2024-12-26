async function generalPopulate(next) {
    try {
      await this.populate("username").execPopulate();
      await this.populate("log").execPopulate();
      next();
    } catch (error) {
      next(error); // Handle errors
    }
  }
  
  // Pre-save middleware
  exerciseSchema.pre('save', function(next) {
    generalPopulate.call(this, next);
  });
  
  // Post-save middleware
  exerciseSchema.post('save', function(doc, next) {
    generalPopulate.call(doc, next);
  });
  