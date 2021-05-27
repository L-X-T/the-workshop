describe('Initial Test', () => {
  it('should check if jest works', () => {
    expect(true).toBe(true);
  });

  it('should do basic math', () => {
    expect(0.2 + 0.1).toBeCloseTo(0.3);
  });
});
