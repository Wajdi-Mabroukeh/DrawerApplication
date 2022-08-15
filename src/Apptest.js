import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import rough from "roughjs/bundled/rough.esm";
import getStroke from "perfect-freehand";
import './App.css';

var canvas = document.getElementById("paint");
var ctx = canvas.getContext("2d");
var width = canvas.width, height = canvas.height;
var curX, curY, prevX, prevY;
var hold = false;
var fill_value = true, stroke_value = false;
var canvas_data = { "pencil": [], "line": [], "rectangle": [], "circle": [], "eraser": [] };
ctx.lineWidth = 2;

function color (color_value){
    ctx.strokeStyle = color_value;
    ctx.fillStyle = color_value;
}

function add_pixel (){
    ctx.lineWidth += 1;
}

function reduce_pixel (){
    if (ctx.lineWidth !== 2)
        ctx.lineWidth -= 1;
}

function fill (){
    fill_value = true;
    stroke_value = false;
}

function outline (){
    fill_value = false;
    stroke_value = true;
}

function reset (){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas_data = { "pencil": [], "line": [], "rectangle": [], "circle": [], "eraser": [] };
}

// pencil tool

function pencil (){

    canvas.onmousedown = function (e){
        curX = e.clientX - canvas.offsetLeft;
        curY = e.clientY - canvas.offsetTop;
        hold = true;

        prevX = curX;
        prevY = curY;
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
    };

    canvas.onmousemove = function (e){
        if(hold){
            curX = e.clientX - canvas.offsetLeft;
            curY = e.clientY - canvas.offsetTop;
            draw();
        }
    };

    canvas.onmouseup = function (e){
        hold = false;
    };

    canvas.onmouseout = function (e){
        hold = false;
    };

    function draw (){
        ctx.lineTo(curX, curY);
        ctx.stroke();
        canvas_data.pencil.push({ "startx": prevX, "starty": prevY, "endx": curX, "endy": curY,
            "thick": ctx.lineWidth, "color": ctx.strokeStyle });
    }
}

// line tool

function line (){

    canvas.onmousedown = function (e){
        const img = ctx.getImageData(0, 0, width, height);
        prevX = e.clientX - canvas.offsetLeft;
        prevY = e.clientY - canvas.offsetTop;
        hold = true;
    };

    canvas.onmousemove = function (e){
        if (hold){
            // ctx.putImageData(img, 0, 0);
            curX = e.clientX - canvas.offsetLeft;
            curY = e.clientY - canvas.offsetTop;
            ctx.beginPath();
            ctx.moveTo(prevX, prevY);
            ctx.lineTo(curX, curY);
            ctx.stroke();
            canvas_data.line.push({ "starx": prevX, "starty": prevY, "endx": curX, "endY": curY,
                 "thick": ctx.lineWidth, "color": ctx.strokeStyle });
            ctx.closePath();
        }
    };

    canvas.onmouseup = function (e){
         hold = false;
    };

    canvas.onmouseout = function (e){
         hold = false;
    };
}

// rectangle tool

function rectangle (){

    canvas.onmousedown = function (e){
        const img = ctx.getImageData(0, 0, width, height);
        prevX = e.clientX - canvas.offsetLeft;
        prevY = e.clientY - canvas.offsetTop;
        hold = true;
    };

    canvas.onmousemove = function (e){
        if (hold){
            // ctx.putImageData(img, 0, 0);
            curX = e.clientX - canvas.offsetLeft - prevX;
            curY = e.clientY - canvas.offsetTop - prevY;
            ctx.strokeRect(prevX, prevY, curX, curY);
            if (fill_value){
                ctx.fillRect(prevX, prevY, curX, curY);
            }
            canvas_data.rectangle.push({ "starx": prevX, "stary": prevY, "width": curX, "height": curY,
                "thick": ctx.lineWidth, "stroke": stroke_value, "stroke_color": ctx.strokeStyle, "fill": fill_value,
                "fill_color": ctx.fillStyle });

        }
    };

    canvas.onmouseup = function (e){
        hold = false;
    };

    canvas.onmouseout = function (e){
        hold = false;
    };
}

// circle tool

function circle (){

    canvas.onmousedown = function (e){
        const img = ctx.getImageData(0, 0, width, height);
        prevX = e.clientX - canvas.offsetLeft;
        prevY = e.clientY - canvas.offsetTop;
        hold = true;
    };

    canvas.onmousemove = function (e){
        if (hold){
            // ctx.putImageData(img, 0, 0);
            curX = e.clientX - canvas.offsetLeft;
            curY = e.clientY - canvas.offsetTop;
            ctx.beginPath();
            ctx.arc(Math.abs(curX + prevX)/2, Math.abs(curY + prevY)/2,
                Math.sqrt(Math.pow(curX - prevX, 2) + Math.pow(curY - prevY, 2))/2, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.stroke();
            if (fill_value)
                ctx.fill();
            canvas_data.circle.push({ "starx": prevX, "stary": prevY, "radius": curX - prevX, "thick": ctx.lineWidth,
                "stroke": stroke_value, "stroke_color": ctx.strokeStyle, "fill": fill_value, "fill_color": ctx.fillStyle });
        }
    };

    canvas.onmouseup = function (e){
        hold = false;
    };

    canvas.onmouseout = function (e){
        hold = false;
    };
}

// eraser tool

function eraser (){

    /*canvas.onmousedown = function (e){
        hold = true;
    };

    canvas.onmousemove = function (e){
        if (hold){
            curX = e.clientX - canvas.offsetLeft;
            curY = e.clientY - canvas.offsetTop;
            ctx.clearRect(curX, curY, 20, 20);
            canvas_data.eraser.push({ "endx": curX, "endy": curY, "thick": ctx.lineWidth });
        }
    };

    canvas.onmouseup = function (e){
        hold = false;
    };

    canvas.onmouseout = function (e){
        hold = false;
    };
    */
    canvas.onmousedown = function (e){
        curX = e.clientX - canvas.offsetLeft;
        curY = e.clientY - canvas.offsetTop;
        hold = true;

        prevX = curX;
        prevY = curY;
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
    };

    canvas.onmousemove = function (e){
        if(hold){
            curX = e.clientX - canvas.offsetLeft;
            curY = e.clientY - canvas.offsetTop;
            draw();
        }
    };

    canvas.onmouseup = function (e){
        hold = false;
    };

    canvas.onmouseout = function (e){
        hold = false;
    };

    function draw (){
        ctx.lineTo(curX, curY);
        ctx.strokeStyle = "#ffffff";
        ctx.stroke();
        canvas_data.eraser.push({ "startx": prevX, "starty": prevY, "endx": curX, "endy": curY,
            "thick": ctx.lineWidth, "color": ctx.strokeStyle });
    }
}

// function save (){
//     const filename = document.getElementById("fname").value;
//     const data = JSON.stringify(canvas_data);
//     const image = canvas.toDataURL();
//
//     $.post("/", { save_fname: filename, save_cdata: data, save_image: image });
//     alert(filename + " saved");
//
// }
const Apptest = () => {

  return (
      <div onLoad="pencil()">
      <p>
        <table>
          <tr>
            <td>
              <fieldset id="toolset">
                <br/>
                  <br/>
                    <button id="penciltool" type="button" style="height: 25px; width: 100px;"
                            onClick="pencil()">Pencil
                    </button>
                    <br/>
                      <br/>
                        <br/>
                          <button id="linetool" type="button" style="height: 25px; width: 100px;"
                                  onClick="line()">Line
                          </button>
                          <br/>
                            <br/>
                              <br/>
                                <button id="rectangletool" type="button" style="height: 25px; width: 100px;"
                                        onClick="rectangle()">Rectangle
                                </button>
                                <br/>
                                  <br/>
                                    <br/>
                                      <button id="circletool" type="button" style="height: 25px; width: 100px;"
                                              onClick="circle()">Circle
                                      </button>
                                      <br/>
                                        <br/>
                                          <br/>
                                            <button id="erasertool" type="button" style="height: 25px; width: 100px;"
                                                    onClick="eraser()">Eraser
                                            </button>
                                            <br/>
                                              <br/>
                                                <br/>
                                                  <button id="resettool" type="button"
                                                          style="height: 25px; width: 100px;" onClick="reset()">Reset
                                                  </button>
                                                </fieldset>
            </td>
            <td>
              <canvas id="paint" width="750" height="450" style="border: 5px solid #000000;">Update your browser to
                support HTML5 Canvas
              </canvas>
            </td>
          </tr>
        </table>
      </p>
    </div>
  );
};

export default Apptest;