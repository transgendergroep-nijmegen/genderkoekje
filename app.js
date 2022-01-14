function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

angular
  .module("app", [])
  .controller("controller", [
    function () {
      this.pronouns = ["hij/zijn", "zij/haar", "die/diens", "hen/hun"];

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

      shuffleArray(this.pronouns);
      this.pronouns.push("andere");
      shuffleArray(this.clothingItems);
      this.physicalItemGroups.map(shuffleArray);
      shuffleArray(this.physicalItemGroups);

      this.profile = {
        name: null,
        pronouns: new Set(),
        identity: {},
        sexuality: {},
        expression: new Set(),
        physical: new Set(),
      };

      this.ui = {
        plot: { x: null, y: null },
      };

      this.Array = Array;

      this.widget = null;

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
  ])
  .directive("dynamicPaddingCentering", function ($window) {
    return {
      restrict: "A",
      link: function (scope, elm, attrs) {
        let parent = elm.parent();

        scope.$watch(
          function () {
            return {
              height: parent.prop("offsetHeight"),
              width: parent.prop("offsetWidth"),
            };
          },
          function (parentSize) {
            let paddings = new Set();
            let f = () => {
              let padding = parseFloat(elm.css("padding-top") || 0);
              let height = elm[0].clientHeight - padding;
              let newPadding = (parentSize.height - height) / 2;
              if (
                Array.from(paddings).every((p) => Math.abs(p - newPadding) >= 5)
              ) {
                elm.css("padding-top", newPadding);
                paddings.add(newPadding);
                setTimeout(f, 20);
              }
            };
            setTimeout(f);
            angular.element($window).on("resize", f);
          },
          true
        );
      },
    };
  })
  .directive("sameDimensionsAsId", function ($window) {
    return {
      restrict: "A",
      link: function (scope, elm, attrs) {
        let element = angular.element(
          document.querySelector(attrs.sameDimensionsAsId)
        );

        let f = function () {
          elm.css("width", element.prop("offsetWidth"));
          elm.css("height", element.prop("offsetHeight"));
        };

        f();

        angular.element($window).on("resize", f);

        // scope.$watch(
        //   function () {
        //     return {
        //       width: element.prop("offsetWidth"),
        //       height: element.prop("offsetHeight"),
        //     };
        //   },
        //   function (elementSize) {
        //     elm.css("width", elementSize.width);
        //     elm.css("height", elementSize.height);
        //   },
        //   true
        // );
      },
    };
  });
