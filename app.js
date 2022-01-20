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
    "$timeout",
    function ($timeout) {
      this.reset = () => {
        this.title = "";

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

        this.physicalItems = [
          "borsten",
          "vagina",
          "baarmoeder/eierstokken",
          "penis/scrotum",
          "testikels",
        ];

        shuffleArray(this.pronouns);
        this.pronouns.push("andere");
        shuffleArray(this.clothingItems);
        shuffleArray(this.physicalItems);

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

        this.view = "intro";
        this.intro = 0;
        this.tutorial = 0;
        this.widget = null;
        this.moreInfo = null;
        this.resultMessage = false;

        $timeout(() => {
          this.intro = 1;
        }, 1000);
      };

      this.reset();

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

      this.tutorialTimeout = () => {
        $timeout(() => {
          if (this.tutorial == 1) {
            this.tutorial = 2;
          }
        }, 3000);
      };

      this.setTitle = () => {
        let pronounString = Array.from(this.profile.pronouns).join(", ");
        if (this.profile.name) {
          this.title = `van ${this.profile.name} (${pronounString})`;
        } else {
          this.title = pronounString;
        }
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
                elm.css("padding-top", newPadding + "px");
                paddings.add(newPadding);
                setTimeout(f, 30);
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
          elm.css("width", element.prop("offsetWidth") + "px");
          elm.css("height", element.prop("offsetHeight") + "px");
        };

        f();
        angular.element($window).on("resize", f);
      },
    };
  });
