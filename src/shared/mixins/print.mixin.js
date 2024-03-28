const printMixin = {
  data() {
    return {
      output: null,
    };
  },
  methods: {
    print() {
      const localOptions = {
        styles: [
          "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css",
          "https://unpkg.com/kidlat-css/css/kidlat.css",
          "./landscape.css",
        ],
      };
      this.$htmlToPaper("printMe", localOptions, () => {
        this.$notify({
          type: "success",
          title: "File printer",
          message: `File saved as pdf successfully.`,
        });
      });
    },
  },
};
export default printMixin;