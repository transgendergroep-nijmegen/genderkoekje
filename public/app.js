function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

firebase.initializeApp({
  apiKey: "AIzaSyAs8_xBrNDOBLX-8ysqyTR0Us5MuHOVLik",
  authDomain: "genderkoekje.firebaseapp.com",
  databaseURL: "https://genderkoekje-default-rtdb.firebaseio.com",
});

angular
  .module("app", ["firebase"])
  .controller("controller", [
    "$scope",
    "$timeout",
    "$firebaseArray",
    function ($scope, $timeout, $firebaseArray) {
      this.entries = $firebaseArray(firebase.database().ref("entries"));

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

        this.email = null;

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
        this.emailForm = false;
        this.sendingMail = false;

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

      this.saveEntry = () => {
        this.entries.$add(
          {
            pronouns: Array.from(this.profile.pronouns),
            identity: this.profile.identity,
            sexuality: this.profile.sexuality,
            expression: Array.from(this.profile.expression),
            physical: Array.from(this.profile.physical),
            timestamp: firebase.database.ServerValue.TIMESTAMP,
          }
        );
      };

      this.sendMail = () => {
        this.error = null;
        this.sendingMail = true;
        html2canvas(document.querySelector("#capture"), {
          backgroundColor: "#ffeadc",
          logging: false,
        })
          .then((canvas) => {
            let dataURL = canvas.toDataURL("image/png");
            fetch(
              "https://script.google.com/macros/s/AKfycbyU_Uy9tOQ0ILDUZEkjPDKERXj91XEaLAq-tSrd8TLi6WV15W-whZ25V3qOmaMI4Q/exec",
              {
                redirect: "follow",
                method: "POST",
                body: JSON.stringify({
                  email: this.email,
                  name: this.profile.name,
                  image: dataURL,
                }),
                headers: {
                  "Content-Type": "text/plain;charset=utf-8",
                },
              }
            )
              .then((response) => {
                this.sendingMail = false;
                this.emailForm = false;
                $scope.$apply();
              })
              .catch((err) => {
                console.log(err);
                this.sendingMail = false;
                this.error = "Sorry, het is niet gelukt om te mailen.";
                $scope.$apply();
              });
          })
          .catch((err) => {
            this.error = "Sorry, het is niet gelukt om te mailen.";
          });
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
