module.exports = {
  listen: (app, PORT) => {
    app.listen(PORT, () => {
      console.log(`listening on port ${PORT}`);
    });
  },
};
