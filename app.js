function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

angular.module("app", []).controller("controller", [
  function () {
    // this.value = 0;
    // this.increment = function (by) {
    //   this.value += by;
    //   console.log("incremented by " + by + ", new value " + this.value);
    // };
    this.clothingItems = [
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "11",
      "12",
    ];

    this.physicalItemGroups = [
      // ["borsten", "vagina", "baarmoeder/eierstokken"],
      // ["penis/scrotum", "testikels"],
      [
        "borsten",
        "vagina",
        "baarmoeder/eierstokken",
        "penis/scrotum",
        "testikels",
      ],
    ];

    shuffleArray(this.clothingItems);
    this.physicalItemGroups.map(shuffleArray);
    shuffleArray(this.physicalItemGroups);

    this.profile = {
      identity: {},
      sexuality: {},
      expression: new Set(),
      physical: new Set(),
    };

    this.ui = {
      plot: { x: null, y: null },
    };

    this.Array = Array;

    this.view = "welcome";

    this.plotMouseover = function (e) {
      let rect = e.target.getBoundingClientRect();
      this.ui.plot.x = ((e.clientX - rect.x) / rect.width) * 100;
      this.ui.plot.y = ((e.clientY - rect.y) / rect.height) * 100;
    };

    this.plotMouseleave = function (e) {
      this.ui.plot.x = this.ui.plot.y = null;
    };

    this.plotMouseclick = function (e, obj) {
      obj.x = this.ui.plot.x;
      obj.y = this.ui.plot.y;
      this.ui.plot.x = this.ui.plot.y = null;
    };
  },
]);
