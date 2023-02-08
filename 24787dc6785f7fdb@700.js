// https://observablehq.com/@barefootbiology/resizing-segmented-vectors@700
import define1 from "./6dcf44d762a0599e@4326.js";
import define2 from "./79750b3b8e929d9d@239.js";

function _1(md){return(
md`# Resizing segmented vectors`
)}

function _2(md){return(
md`*Draft - Work In Progress - Subject to Change*`
)}

function _3(md){return(
md`## Motivation

I study inherited retinal diseases. My projects often involve images collected in the ophthalmology clinic. I segment these images to identify different layers of the retina. I'm building a model that let's me artificially reduce some of these layers. This model will let me simulate some diseases.

To visualize the results, I need to modify each column of pixels in the original retinal image. Using R, I can produce the decent looking simulations:`
)}

function _4(FileAttachment){return(
FileAttachment("bscan_simulation.png").image()
)}

function _5(md){return(
md`But R isn't great for interactivity--at least, not without a lot of work in Shiny. So now I'm trying to port my R code to Observable.`
)}

function _6(md){return(
md`## The problem simplified: One vector of pixel values

Suppose we have a vector of voxel intensities. For simplicity, I'm going to make the voxel intensity values range from 0 to 9. This also happens to be the index of each voxel:`
)}

function _v0(d3){return(
d3.range(0, 20)
)}

function _8(md){return(
md`We have some initial segmentation of this vector. These initial segmentations will always be positioned at the inner surface of a layer, that is, where the layer begins. For now, we'll use integer positions*:`
)}

function _s0(){return(
[0, 5, 9, 12, 17]
)}

function _10(md){return(
md`## From surface positions to layer thicknesses`
)}

function _11(md){return(
md`We can also compute the thickness of each layer from the surface vector. To do this, we need to know the length of the data vector:`
)}

function _compute_thickness(){return(
function(layer_starts, length) {
  
  let result = layer_starts.map((d,i) => {
    if(i < (layer_starts.length - 1)) {
      return layer_starts[i+1] - layer_starts[i]
    }
    return length - layer_starts[i]
  })

  return result
}
)}

function _t0(compute_thickness,s0,v0){return(
compute_thickness(s0, v0.length)
)}

function _14(md){return(
md`As a sanity check, we should get the original vector length if we sum up all the thickness values:`
)}

function _15(v0,d3,t0){return(
v0.length == d3.sum(t0)
)}

function _16(md){return(
md`## From layer thicknesses to layers

Given what we know about the thicknness of each layer and the total length of the data vector, we can compute a new vector that represents the identity of each layer. We'll use a function that's like the \`inverse.rle\` function from the R programming language.`
)}

function _inverse_rle(d3){return(
function(lengths, values) {
  // TASK: ERROR if lengths.length != values.length

  // Create an array to hold the result
  let result_length = d3.sum(lengths)

  let result = new Array(result_length)

  // Position in result
  let r = 0;
  // For each of the values...
  for (let i = 0; i < values.length; i++) {
    // ... add it the number of times specified in `lengths`
    for(let j = 0; j < lengths[i]; j++) {
      result[r] = values[i]
      r++
    }
  }
  
  return result
}
)}

function _layers(inverse_rle,t0,d3){return(
inverse_rle(t0, d3.range(0, t0.length))
)}

function _19(md){return(
md`## Modifying layer thicknesses`
)}

function _20(md){return(
md`Once we can represent the layers by their thickness values, we can modify the thickness values. Suppose we wanted to reduce the thickness of the 4th layer by 25%. Our constraint is that the total layer thickness must remain constant. So whatever we lose in thickness in the fourth layer must be added somewhere else. For this example, we'll add that missing thickness to the 1st layer.

First, we'll construct a vector to indicate the change in layer thicknesses:`
)}

function _t_reduce(){return(
[1, 1, 1, 0.75, 0]
)}

function _22(md){return(
md`Now we'll multiply the thickness vector by the reduction vector:`
)}

function _t1(t0,t_reduce){return(
t0.map((d, i) => d * t_reduce[i])
)}

function _24(md){return(
md`Next we'll compute how much thickness has been lost:`
)}

function _t1_lost(d3,t0,t1){return(
d3.sum(t0) - d3.sum(t1)
)}

function _add_missing_thickness(){return(
function(thickness_vector, missing_thickness, index) {
  return thickness_vector.map((d, i) => {
    if(i == index) {
      return d + missing_thickness
    } else {
      return d
    }
  })
}
)}

function _t2(add_missing_thickness,t1,t1_lost){return(
add_missing_thickness(t1, t1_lost, 0)
)}

function _28(md){return(
md`Now the total thickness should be correct:`
)}

function _29(d3,t0,t2){return(
d3.sum(t0) == d3.sum(t2)
)}

function _30(md){return(
md`## From modified layer thicknesses to modified vectors`
)}

function _31(md){return(
md`Now we can use the data we have to generate a modified version of the original vector. To do this, we'll have to make some assumptions about what values should occur within each segment.

For my motivating example, I have to goals:

1. Maintain the order of elements within a segment (layer) of the vector.
2. Allow for some randomness within the result.

To do this, we'll upsample or downsample the vector as needed, but we'll use a random order to do it. Our procedure, however, is complicated by the fact that after modification we no longer have integer thicknesses: some layers are partial. We'll need a way to deal with this problem.`
)}

function _32(md){return(
md`We have a couple of options. 

1. The easiest option is to round the thickness values to the nearest integer, then adjust the thickness of the first layer as needed. However, this procedure will mean that we'll get a bit of difference between our [new surface positions] and the new data vector.
2. We can combine data vector elements based on how much they overlap in adjacent layers. For instance, [SHOW EXAMPLE].`
)}

function _33(md){return(
md`## Randomly remove elements in a vector to shrink the vector`
)}

function _randomly_remove(d3){return(
function(x, new_length){
  let n0 = x.length
  let index0 = d3.range(0, n0)

  let random_indices = new Array(n0 - new_length)

  let temp_index = index0.map(d => d)

  for(let i = 0; i < (n0 - new_length); i++) {
    let random_index = d3.randomInt(0, temp_index.length)()
    temp_index.splice(random_index, 1)
  }
  
  return temp_index.map((d, i) => x[d])
}
)}

function _35(randomly_remove,d3){return(
randomly_remove(d3.range(0, 10), 8)
)}

function _36(md){return(
md` The returned array should always be sorted from lowest to highest index.`
)}

function _37(d3,randomly_remove)
{ 
  let test_input = d3.range(0, 10)
  let test_output = randomly_remove(test_input, 10)
  let test_output_sorted = d3.sort(test_output)
  let test_results = test_output_sorted.map((d, i) => +(d == test_input[i]))
  
  return (d3.sum(test_results) == test_input.length)
}


function _38(md){return(
md`## Randomly inject elements in a vector to enlarge the vector

We can make a similar function to randomly inject values:`
)}

function _randomly_inject(d3){return(
function(x, new_length) {
  let n0 = x.length
  let index0 = d3.range(0, n0)
  
  let result = new Array(x.length)

  for(let i = 0; i < x.length; i++) {
    result[i] = x[i]
  }

  
  // Where in the result vector should random values be injected?
  let inject_index = d3.range(0, new_length - x.length).map(d => d3.randomInt(0, new_length)())

  let inject_index_sorted = d3.sort(inject_index)

  // Which values will we inject into the result vector?
  let inject_values = d3.range(0, new_length - x.length).map(d => x[d3.randomInt(0, x.length)()])

  for(let j = 0; j < inject_index_sorted.length; j++) {
    result.splice(inject_index_sorted[j], 0, inject_values[j])
  }

  return result
  // return {"result": result, "inject_index_sorted": inject_index_sorted, "inject_values": inject_values}
}
)}

function _40(randomly_inject,d3){return(
randomly_inject(d3.range(0, 4), 9)
)}

function _41(){return(
new Array(10)
)}

function _42(md){return(
md`We can now make a function that can either randomly remove or inject based on the new input length:`
)}

function _randomly_inject_remove(randomly_inject,randomly_remove){return(
function(x, new_length) {
  if(x.length == new_length) {
    return x
  } else if(x.length < new_length) {
    return randomly_inject(x, new_length)
  } 
    return randomly_remove(x, new_length)
}
)}

function _44(randomly_inject_remove,d3){return(
randomly_inject_remove(d3.range(0, 10), 10)
)}

function _45(randomly_inject_remove,d3){return(
randomly_inject_remove(d3.range(0, 10), 6)
)}

function _46(randomly_inject_remove,d3){return(
randomly_inject_remove(d3.range(0, 10), 12)
)}

function _47(md){return(
md`## Dealing with non-integer thickness values

The simplest method for dealing with non-integer thickness values is to round the thickness values to the nearest integer. After rounding, we'll need to deal with any residual thickness by adjusting the first layer thickness.`
)}

function _t3(t2){return(
t2.map(d => Math.round(d))
)}

function _t3_lost(d3,t3,t2){return(
d3.sum(t3) - d3.sum(t2)
)}

function _t4(add_missing_thickness,t3,t3_lost){return(
add_missing_thickness(t3, t3_lost, 0)
)}

function _51(md){return(
md`Now we have integer thickness values, at the expense of true layer thickness loss. For our motivating use case, this shouldn't matter much.*`
)}

function _52(md){return(
md`## From layer thicknesses to surface positions

We can now generate the surface positions from the layer thicknesses:`
)}

function _s4(d3,t3){return(
d3.cumsum(t3)
)}

function _54(s4){return(
s4
)}

function _modify_vector(compute_thickness,randomly_inject_remove){return(
function(x, surfaces_original, thickness_modified){
  let result = new Array(x.length)

  let thickness_original = compute_thickness(surfaces_original, x.length)
  
  // Index in the result
  let j = 0

  // For each layer in the original
  for (let l = 0; l < thickness_modified.length; l++) {
    // Cut the values from the original vector in the original layer.
    let original_data = x.slice(surfaces_original[l], surfaces_original[l] + thickness_original[l])
    
    // Re-sample the values based on the new thickness.
    let new_data = randomly_inject_remove(original_data, thickness_modified[l])

    // For each value in the new data
    for(let i = 0; i < new_data.length; i++) {
      // Insert the results into the result vector
      result[j] = new_data[i]
      j++
    }
  }
  
  return result
}
)}

function _56(t4){return(
t4
)}

function _v4(modify_vector,v0,s0,t4){return(
modify_vector(v0, s0, t4)
)}

function _58(md){return(
md`## Visualizing the result

To visualize the result, let's put the relevant pieces of data into an object:`
)}

function _data(d3,v0,layers,inverse_rle,t4,v4){return(
d3.range(0, v0.length)
  .map(d => { return { 
    "index": d, 
    "0_original_vector": v0[d], 
    "1_original_layers": layers[d], 
    "2_modified_layers": inverse_rle(t4, d3.range(0, t4.length))[d], 
    "3_modified_vector": v4[d] 
  }})
)}

function _data_folded(aq,data){return(
aq.from(data)
	.fold(['0_original_vector','1_original_layers','2_modified_layers','3_modified_vector'])
)}

function _64(t_reduce){return(
t_reduce
)}

function _plot_data(Plot,data_folded){return(
Plot.plot({
  marks: [
    Plot.cell(data_folded, {
      x: "key",
      y: "index",
      fill: "value"
    })
  ]
})
)}

function _66(md){return(
md`I'm now ready to apply these methods to my simulation model.`
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["bscan_simulation.png", {url: new URL("./files/e6d5a8b97feb4999660764c12af9670d458ae98ee33892ca713f767b0231f11325e8defb8741413628ba0925cb0bc8054be3f04b957fa405a6c7445aa466c038.png", import.meta.url), mimeType: "image/png", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer()).define(["FileAttachment"], _4);
  main.variable(observer()).define(["md"], _5);
  main.variable(observer()).define(["md"], _6);
  main.variable(observer("v0")).define("v0", ["d3"], _v0);
  main.variable(observer()).define(["md"], _8);
  main.variable(observer("s0")).define("s0", _s0);
  main.variable(observer()).define(["md"], _10);
  main.variable(observer()).define(["md"], _11);
  main.variable(observer("compute_thickness")).define("compute_thickness", _compute_thickness);
  main.variable(observer("t0")).define("t0", ["compute_thickness","s0","v0"], _t0);
  main.variable(observer()).define(["md"], _14);
  main.variable(observer()).define(["v0","d3","t0"], _15);
  main.variable(observer()).define(["md"], _16);
  main.variable(observer("inverse_rle")).define("inverse_rle", ["d3"], _inverse_rle);
  main.variable(observer("layers")).define("layers", ["inverse_rle","t0","d3"], _layers);
  main.variable(observer()).define(["md"], _19);
  main.variable(observer()).define(["md"], _20);
  main.variable(observer("t_reduce")).define("t_reduce", _t_reduce);
  main.variable(observer()).define(["md"], _22);
  main.variable(observer("t1")).define("t1", ["t0","t_reduce"], _t1);
  main.variable(observer()).define(["md"], _24);
  main.variable(observer("t1_lost")).define("t1_lost", ["d3","t0","t1"], _t1_lost);
  main.variable(observer("add_missing_thickness")).define("add_missing_thickness", _add_missing_thickness);
  main.variable(observer("t2")).define("t2", ["add_missing_thickness","t1","t1_lost"], _t2);
  main.variable(observer()).define(["md"], _28);
  main.variable(observer()).define(["d3","t0","t2"], _29);
  main.variable(observer()).define(["md"], _30);
  main.variable(observer()).define(["md"], _31);
  main.variable(observer()).define(["md"], _32);
  main.variable(observer()).define(["md"], _33);
  main.variable(observer("randomly_remove")).define("randomly_remove", ["d3"], _randomly_remove);
  main.variable(observer()).define(["randomly_remove","d3"], _35);
  main.variable(observer()).define(["md"], _36);
  main.variable(observer()).define(["d3","randomly_remove"], _37);
  main.variable(observer()).define(["md"], _38);
  main.variable(observer("randomly_inject")).define("randomly_inject", ["d3"], _randomly_inject);
  main.variable(observer()).define(["randomly_inject","d3"], _40);
  main.variable(observer()).define(_41);
  main.variable(observer()).define(["md"], _42);
  main.variable(observer("randomly_inject_remove")).define("randomly_inject_remove", ["randomly_inject","randomly_remove"], _randomly_inject_remove);
  main.variable(observer()).define(["randomly_inject_remove","d3"], _44);
  main.variable(observer()).define(["randomly_inject_remove","d3"], _45);
  main.variable(observer()).define(["randomly_inject_remove","d3"], _46);
  main.variable(observer()).define(["md"], _47);
  main.variable(observer("t3")).define("t3", ["t2"], _t3);
  main.variable(observer("t3_lost")).define("t3_lost", ["d3","t3","t2"], _t3_lost);
  main.variable(observer("t4")).define("t4", ["add_missing_thickness","t3","t3_lost"], _t4);
  main.variable(observer()).define(["md"], _51);
  main.variable(observer()).define(["md"], _52);
  main.variable(observer("s4")).define("s4", ["d3","t3"], _s4);
  main.variable(observer()).define(["s4"], _54);
  main.variable(observer("modify_vector")).define("modify_vector", ["compute_thickness","randomly_inject_remove"], _modify_vector);
  main.variable(observer()).define(["t4"], _56);
  main.variable(observer("v4")).define("v4", ["modify_vector","v0","s0","t4"], _v4);
  main.variable(observer()).define(["md"], _58);
  main.variable(observer("data")).define("data", ["d3","v0","layers","inverse_rle","t4","v4"], _data);
  const child1 = runtime.module(define1);
  main.import("Wrangler", child1);
  main.import("op", child1);
  const child2 = runtime.module(define2);
  main.import("aq", child2);
  main.variable(observer("data_folded")).define("data_folded", ["aq","data"], _data_folded);
  main.variable(observer()).define(["t_reduce"], _64);
  main.variable(observer("plot_data")).define("plot_data", ["Plot","data_folded"], _plot_data);
  main.variable(observer()).define(["md"], _66);
  return main;
}
