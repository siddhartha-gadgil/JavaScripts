angular.module('CondConv',[])
.controller('CondConvController', ['$scope', function($scope) {
      function include(sum, target, element) {
        return Math.abs(target - sum - element) < Math.abs(target - sum)
      }
      function approxSeq(target, seq, error) {
        var accum = [];
        var partialsum = 0.0;
        for (var n = 1.0; Math.abs(target - partialsum) > error; n++) {
          if (include(partialsum, target, seq(n))) {
            accum.push(seq(n));
            partialsum += seq(n);
          }
        }
        return accum;
      }

      var example = function (n) {
        if (n % 2 == 1) {
          return (-1.0) / n;
        } else return 1.0 / n;
      };

      $scope.fntext = "n %2 == 1 ? -1 / n : 1 /n";

      $scope.seqtext = $scope.fntext;

      $scope.updatefmla = function(){
          $scope.seqtext = $scope.fntext;
          rawprint = true;
      };

      function parsefn(txt){
          return new Function('n', "return " + txt);
      }

      var rawprint = false;

        function oneovern (x) {
          if (rawprint) return x.toString();
        var d = Math.round(1 / x);
        if (d < 0) return "(-1/" + (-d).toString() + ")"; else return "(1/" + d.toString() + ")";
      }

      function printSeq(seq) {
        var sum = seq.reduce(function (a, b) {
          return a + b;
        }, 0.0);
        var elems = seq.map(oneovern);
        return sum.toString() + " = " + elems.reduce(function (a, b) {
              return a + " + " + b;
            }, '');
      }


      function plotSeq(seq, target){
          context.clearRect(0, 0, Width, Height);
          drawLine(0, 0, Width, 0, "black");
          drawLine(0, target, Width, target, "red");
          var partialsum = 0.0;
          var spc = $scope.spacing;
          var x = 1;
          seq.forEach(function(y){
              partialsum += y;
              drawLine($scope.spacing * x, 0, $scope.spacing * x, partialsum, "blue");
              x += 1;
          })
      }

      $scope.accuexp = 1.0;

      $scope.result =function () {
        var targ = parseFloat($scope.target);
        var accu = Math.pow(10.0, - parseFloat($scope.accuexp)/10.0);
        var approx = approxSeq(targ, parsefn($scope.seqtext),  accu);
        var out =  printSeq(approx);
          plotSeq(approx, targ);
        return out;
      };

      var canvas = document.querySelector('#canvas');

      var context = canvas.getContext('2d');

      $scope.spacing = 5;

      var Height = 200;

      var Width = 1000;

      $scope.yscale = 15;

      $scope.target='1.0';

      function drawLine(x1, y1, x2, y2, colour, width) {
        context.beginPath();
        context.lineWidth = width;
        context.strokeStyle = colour;
        context.moveTo(x1, -(y1 * $scope.yscale) + Height / 2);
        context.lineTo(x2, -(y2 * $scope.yscale) + Height / 2);
        context.closePath();
        context.stroke();
      }
      drawLine(0, 0, Width, 0, "black");
    }]);
