###
# Coffee Scripted!
# appModule{}
# Main site functions
###
# Trigger gulp client-js after editing this file
"use strict";
window.appModule = {}

appModule = ( ->

  privateCounter = 0

  privateBuildHeaderDate = ->
    d = new Date()
    monthNames = ["January","February","March","April","May","June",
      "July","August","September","October","November","December"]
    day = d.getDate()
    monthIndex = d.getMonth()
    year = d.getFullYear()
    writtenDate = day + ' ' + monthNames[monthIndex] + ' ' + year;
    return writtenDate;

  publicRunStart = ->
      publicGetHeaderDate();
      console.log('init, publicRunStart happened');

  publicGetHeaderDate = ->
      privateBuildHeaderDate();

    publicGetCount = ->
      privateCounter;

  # init example http://stackoverflow.com/questions/8288628/javascript-revealing-module-pattern-and-coffeescript/8288666#8288666
  # config = colors: [ "#F63", "#CC0", "#CFF" ]
  # init = ->
  #   self = this
  #   anchors = document.getElementsByTagName("a")
  #   size = anchors.length
  #   i = 0
  #
  #   while i < size
  #     anchors[i].color = config.colors[i]
  #     anchors[i].onclick = ->
  #       self.changeColor this, @color
  #       false
  #     i++
  #
  # changeColor = (linkObj, newColor) ->
  #   linkObj.style.backgroundColor = newColor
  #
  # init: init
  # changeColor: changeColor
  #end init example

  # Now reveal public pointers to
  # private functions and properties
  return {
      init: publicRunStart,
      getDate: publicGetHeaderDate
  };
)()
appModule.init();
#
# as a class
#
#
# class appModule
#   privateBuildHeaderDate() ->
#     d = new Date()
#     monthNames = ["January", "February", "March",
#       "April", "May", "June", "July",
#       "August", "September", "October",
#       "November", "December"]
#     day = d.getDate()
#     monthIndex = d.getMonth()
#     year = d.getFullYear()
#     writtenDate = day + ' ' + monthNames[monthIndex] + ' ' + year;
#     return writtenDate;
#   publicRunStart() ->
#       publicGetHeaderDate();
#       console.log('init, publicRunStart happened');
#   publicGetHeaderDate() ->
#       privateBuildHeaderDate();
#   return {
#       init: publicRunStart,
#       getDate: getHeaderDate,
#       count: publicGetCount
#   };
#
# https://scotch.io/bar-talk/4-javascript-design-patterns-you-should-know
# // var myRevealingModule = (function () {
# //
# //         var privateCounter = 0;
# //
# //         function privateFunction() {
# //             privateCounter++;
# //         }
# //
# //         function publicFunction() {
# //             publicIncrement();
# //         }
# //
# //         function publicIncrement() {
# //             privateFunction();
# //         }
# //
# //         function publicGetCount(){
# //           return privateCounter;
# //         }
# //
# //         // Reveal public pointers to
# //         // private functions and properties
# //
# //        return {
# //             start: publicFunction,
# //             increment: publicIncrement,
# //             count: publicGetCount
# //         };
# //
# //     })();
# //
# // myRevealingModule.start();
# //https://addyosmani.com/resources/essentialjsdesignpatterns/book/#summarytabledesignpatterns
