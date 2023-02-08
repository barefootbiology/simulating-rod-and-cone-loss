import define1 from "./79750b3b8e929d9d@239.js";
import define2 from "./26670360aa6f343b@202.js";
import define3 from "./a33468b95d0b15b0@808.js";
import define4 from "./ab3e70b29c480e6d@83.js";
import define5 from "./6dcf44d762a0599e@4326.js";
import define6 from "./3c37c9bffc213235@211.js";
import define7 from "./24787dc6785f7fdb@700.js";

function _1(md){return(
md`# Visualizing the loss of rod and cone photoreceptor cells

Could you guess what percentage of photoreceptor cells were lost? The difference between 100% surviving rods and 50% surviving rods is subtle. To see just how subtle cell loss can be, try changing the percentages of rods and cones below:`
)}

function _bscan_canvas_segmentation(html,image_data,which_eye,d3,DOM,thickness_modified_eye,y_domain,show_layers,show_bscan,modify_working,is_simulated)
{
  // Modifying Mike Bostock's example: https://observablehq.com/@d3/canvas-horizon-chart
  const div = html`<div style="position:relative;">`;

  let bscan = image_data.filter(d => d.laterality == which_eye )

  let width = 768
  let height = 496

  // image_data.filter(d => d.laterality == which_eye )[0].image
  const canvas = d3.select(div)
    .selectAll("canvas")
    .data(bscan)
    .enter().append(() => DOM.context2d(width, height).canvas)
      .style("position", "absolute")
      .style("width", `${width}px`)
      .style("height", `${height}px`)
      .each(draw_bscan)

    const svg = d3.select(div.appendChild(DOM.svg(768, 496)))
      .style("position", "relative")

  // TASK: Add line data here...

  // svg.append("g")
  //     .call(xAxis);
  let data_no_vitreous = thickness_modified_eye
    .filter(d => d["surface_id"] > 1)
    .orderby("surface_id")

  let data = Array.from(d3.group(data_no_vitreous, d => d.surface_id), ([key, value]) => ({key, value}))
  
  let x = d3.scaleLinear()
    .range([0, width])
    .domain([1,768])

  let y = d3.scaleLinear()
    .range([height, 0])
    .domain(y_domain)

  let line = d3.line()
    .x(d => x(d.ascan_id))
    .y(d => y(d.z_um))

  let area = d3.area()
    .x(d => x(d.ascan_id))
    .y0(496)
    .y1(d => y(d.z_um))

  let color = d3.scaleOrdinal()
    .domain(d3.range(2, 12))
    .range(d3.schemePaired)
  
  let layers = svg.append("g")
    .selectAll(".layers")
    .data(data)
    .enter().append("path")
      .attr("id", d => +d.key)
      .attr("stroke", d => color(+d.key))
      //  .attr("stroke", d => color(+d.key))    
      .attr("fill", d => color(+d.key))
      // .attr("fill", d => color(+d.key))
      .attr("opacity", +(show_layers == "Layers"))
      .attr("d", d=> area(d.value))  

  let lines = svg.append("g")
    .selectAll(".surfaces")
    .data(data)
    .enter().append("path")
      .attr("id", d => +d.key)
      .attr("stroke", d => color(+d.key))
      .attr("fill", "none")
      .attr("opacity", +(show_layers == "Surfaces"))
      .attr("stroke-width", 2)
      .attr("d", d=> line(d.value))  

  function draw_bscan (d) {

    const context = this.getContext("2d");
    // canvas.style = "width: 60%";
    this.width = width
    this.height = height

    console.log("this:", this.width, this.height)
  
    context.drawImage(d.image, 0, 0, width, height);

  
    if(show_bscan) {
  
      const bscanData = context.getImageData(
        0,
        0,
        width,
        height
      );

      console.log("bscanData: width = ", bscanData.width, ", height = ", bscanData.height)
  
      // modify_segmentation(bscanData.data, thickness_modified_eye.orderby("surface_id").objects())
      modify_working(bscanData.data, thickness_modified_eye.orderby("surface_id").objects())

      console.log("bscanData: width = ", bscanData.width, ", height = ", bscanData.height)

      
      context.putImageData(bscanData, 0, 0);
    }

    // Change the title if photoreceptor survival drops below 100%
    let title = "Original"
    if(is_simulated & show_bscan) {
      title = "Simulation"
    } 
  
    context.fillStyle = "#B88A00";
    context.font = "30px Helvetica";
    context.fillText(title, 10, 40);

    // return canvas;
  }


  
    return div
}


function _legend(Swatches,d3,plot_fill,layer_scale){return(
Swatches(d3.scaleOrdinal(plot_fill.domain.map(d => layer_scale(d - 1)), plot_fill.range), {title: "Retinal layers"})
)}

function _4(html,rods_surviving,cones_surviving){return(
html`<strong>Figure 1:</strong> ${(rods_surviving * 100).toFixed(0)}% rods surviving and ${(cones_surviving * 100).toFixed(0)}% cones. Adjust the controls below.`
)}

function _show_layers(Inputs){return(
Inputs.radio(["None", "Surfaces", "Layers"], {value: "None", label: "Display retinal layer segmentation?"})
)}

function _rods_surviving_percentage(Inputs){return(
Inputs.range([0, 100], {step: 1, label: "Percentage of rods surviving", value: 100})
)}

function _cones_surviving_percentage(Inputs){return(
Inputs.range([0, 100], {step: 1, label: "Percentage of cones surviving", value: 100})
)}

function _which_eye(Inputs){return(
Inputs.radio(["OD", "OS"], {label: "Select eye", value:  "OD"})
)}

function _show_bscan(Inputs){return(
Inputs.toggle({label: "Simulated B-scan: Show / Hide", value: true})
)}

function _10(md){return(
md`## Quiz
Try guessing what percentage of rod and cone photoreceptor cells survive in the following patient:`
)}

function _11(bscan_canvas,bscan_random,thickness_modified_eye_random){return(
bscan_canvas(bscan_random, thickness_modified_eye_random.orderby("surface_id").objects(), true, true)
)}

function _new_quiz(Inputs,set,$0){return(
Inputs.button("New quiz", {reduce: () => set($0, 0)} )
)}

function _13(md){return(
md`Your guesses:`
)}

function _rods_surviving_guess_percentage(Inputs){return(
Inputs.range([0, 100], {step: 1, label: "Percentage of rods surviving", value: 100})
)}

function _cones_surviving_guess_percentage(Inputs){return(
Inputs.range([0, 100], {step: 1, label: "Percentage of cones surviving", value: 100})
)}

function _submit_guess(Inputs){return(
Inputs.button("Submit guess")
)}

function _17(submit_guess,md,rods_surviving_random,rods_surviving_difference,cones_surviving_random,cones_surviving_difference){return(
submit_guess ?  md`Actual surviving rods: ${Math.round(rods_surviving_random * 100)}%. Your answer was off by ${Math.round(rods_surviving_difference)}%<br>Actual surviving cones: ${Math.round(cones_surviving_random * 100)}%. Your answer was off by ${Math.round(cones_surviving_difference)}%` :  md`Awaiting your guess.`
)}

function _18(md){return(
md`## How it works

To build the model, we used rod and cone density data originally published in (Curcio, C. A., Sloan, K. R., Kalina, R. E., Hendrickson, A. E., 1990. [Human photoreceptor topography](https://doi.org/10.1002/cne.902920402). J Comp Neurol 292, 497-523. PMID 2324310). Dr. Curcio has made the data available for download from her [research website](https://christineacurcio.com/PRtopo/). Using custom software, we registered the cell density data to an OCT volume in R, interpolated cell densities for every A-scan in the volume, and computed the expected proportion of rods and cones at each position. The model implemented here assumes that thickness of the outer retina is proportional to the surviving proportion of rods and cones.`
)}

function _19(md){return(
md`## Appendix A: Math`
)}

function _20(md){return(
md`We modify the thickness data based on the number of surviving rods and cones:`
)}

function _21(tex){return(
tex.block`thickness_{new}= thickness_{original} \times ((proportion_{rods}\times surviving_{rods}) + (1 - proportion_{rods})\times surviving_{cones} )`
)}

function _22(md){return(
md`## Appendix B: Code`
)}

function _rods_surviving(rods_surviving_percentage){return(
rods_surviving_percentage / 100
)}

function _cones_surviving(cones_surviving_percentage){return(
cones_surviving_percentage / 100
)}

function _rods_surviving_guess(rods_surviving_guess_percentage){return(
rods_surviving_guess_percentage / 100
)}

function _cones_surviving_guess(cones_surviving_guess_percentage){return(
cones_surviving_guess_percentage / 100
)}

function _29(md){return(
md`### Data import`
)}

function _30(md){return(
md`Import central B-scan image:`
)}

function _31(FileAttachment){return(
FileAttachment("central_bscan_od@2.png").url()
)}

function _32(FileAttachment){return(
FileAttachment("central_bscan_od@2.png").url()
)}

function _bscan_os_image(FileAttachment){return(
FileAttachment("central_bscan_os@1.png").image()
)}

function _bscan_od_image(FileAttachment){return(
FileAttachment("central_bscan_od@2.png").image()
)}

async function _image_data(bscan_od_image,FileAttachment,bscan_os_image){return(
[
  {laterality: "OD", image: bscan_od_image, url: "https://raw.githubusercontent.com/barefootbiology/examplebscans/main/data/central_bscan_od.png", url2: await FileAttachment("central_bscan_od@2.png").url(), x: 0, y: 0}, 
  {laterality: "OS", image: bscan_os_image, url: "https://raw.githubusercontent.com/barefootbiology/examplebscans/main/data/central_bscan_os.png", url2: await FileAttachment("central_bscan_os@1.png").url(), x: 0, y: 0}
]
)}

function _image_data_eye(aq,image_data,which_eye){return(
aq.from(image_data)
   .filter(aq.escape(d => d["laterality"] == which_eye))
)}

function _simulated_bscan(bscan_canvas,bscan,thickness_modified_eye,show_bscan,is_simulated){return(
bscan_canvas(bscan, thickness_modified_eye.orderby("surface_id").objects(), show_bscan, is_simulated)
)}

function _current_bscan_data(simulated_bscan)
{
  return { "url": simulated_bscan.toDataURL(), "x": 0, "y": 0 }
    }


function _data_file(FileAttachment){return(
FileAttachment("central_bscan_data@2.tsv")
)}

function _bscan_canvas(DOM,modify_working){return(
function(bscan, thickness_data, show_bscan, is_simulated){
  
    const canvas = DOM.canvas(bscan.naturalWidth, bscan.naturalHeight);
    const context = canvas.getContext("2d");
    canvas.style = "width: 60%";
  
    context.drawImage(bscan, 0, 0, bscan.naturalWidth, bscan.naturalHeight);

  
    if(show_bscan) {
  
      const bscanData = context.getImageData(
        0,
        0,
        bscan.naturalWidth,
        bscan.naturalHeight
      );
  
      // modify_segmentation(bscanData.data, thickness_modified_eye.orderby("surface_id").objects())
      modify_working(bscanData.data, thickness_data)
    
      context.putImageData(bscanData, 0, 0);
    }

    // Change the title if photoreceptor survival drops below 100%
    let title = "Original"
    if(is_simulated & show_bscan) {
      title = "Simulation"
    } 
  
    context.fillStyle = "#B88A00";
    context.font = "30px Helvetica";
    context.fillText(title, 10, 40);

    return canvas;
  
}
)}

async function _thickness_data(d3,data_file){return(
d3.tsvParse(await data_file.text(data_file), d3.autoType)
)}

function _modify_thickness(aq,op){return(
function(data, rods_surviving, cones_surviving) {
  let thickness_modified = aq.from(data)
  	.derive(
      {
        thickness_modified: 
          aq.escape(d => 
                    d.is_outerretina * d.thickness * 
                    (d.proportion_rods * rods_surviving + 
                    (1 - d.proportion_rods) * cones_surviving) + 
                    (1 - d.is_outerretina) * d.thickness)
      }
    )
    .derive({laterality_ascan_group: d => d.laterality + "_" + d.ascan_id})
    .groupby('laterality_ascan_group')
  	.orderby("ascan_id")
  	.orderby(aq.desc("surface_id"))
    .derive({ z_original: aq.rolling(d => op.sum(d.thickness)) }) 
    .derive({ thickness_residual: d => op.sum(d.thickness) - op.sum(d.thickness_modified)})
    .derive({ thickness_modified_adjusted: d => (d.surface_id == 1) ? d.thickness_modified + d.thickness_residual : d.thickness_modified })
    // For dealing with voxel data:
    .derive({ thickness_mod_rounded: d => Math.round(d.thickness_modified_adjusted)})
    .derive({ thickness_mod_rounded_residual: d => op.sum(d.thickness) - op.sum(d.thickness_mod_rounded) })
    .derive({ thickness_mod_rounded_adjusted: d => (d.surface_id == 1) ? d.thickness_mod_rounded + d.thickness_mod_rounded_residual : d.thickness_mod_rounded })
    .derive({ z: aq.rolling(d => op.sum(d.thickness_modified_adjusted)) })
    .derive({ z_um: d => (496 - d.z) * d.z_units * 1000})
    .ungroup()
  	// .objects() // Uncomment to return an array of objects
  return thickness_modified
}
)}

function _thickness_modified(modify_thickness,thickness_data,rods_surviving,cones_surviving){return(
modify_thickness(thickness_data, rods_surviving, cones_surviving)
)}

function _thickness_modified_eye(thickness_modified,aq,which_eye){return(
thickness_modified
  .filter(aq.escape(d => d["laterality"] == which_eye))
)}

function _45(md){return(
md`### Basic plotting parameters`
)}

function _46(md){return(
md`Scales for plotting the original thickness data:`
)}

function _x(d3,thickness_data,margin,width){return(
d3.scaleLinear()
    .domain([1, d3.max(thickness_data, d => d.ascan_id)])
    .range([margin.left, width - margin.right])
    .interpolate(d3.interpolateRound)
)}

function _x_mm(d3,thickness_data,margin,width){return(
d3.scaleLinear()
  .domain([d3.min(thickness_data, d => d.x_mm), d3.max(thickness_data, d => d.x_mm)])
  .range([margin.left, width - margin.right])
  .interpolate(d3.interpolateRound)
)}

function _y(d3,height,margin){return(
d3.scaleLinear()
    .domain([1, 496])
    .range([height - margin.top, margin.bottom])
    .interpolate(d3.interpolateRound)
)}

function _color_surface(d3){return(
d3.scaleOrdinal()
    .range(d3.schemePaired)
    .domain([2,3,4,5,6,7,8,9,10])
)}

function _51(md){return(
md`Note that the y scale needs to flip the axis:`
)}

function _52(md){return(
md`Scales for the surface segmentation plots:`
)}

function _height(){return(
400
)}

function _margin(){return(
{top: 20, right: 0, bottom: 0, left: 30}
)}

function _surface_ids(){return(
[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
)}

function _56(md){return(
md`These plotting functions are works in progress. I want to add a legend for the retinal layers, but haven't got it working yet.`
)}

function _layer_scale(d3){return(
d3.scaleOrdinal()
  .domain([0,1,2,3,4,5,6,7,8,9,10,11])
  .range(["vitreous", "nerve fiber layer", "ganglion cell layer", "inner plexiform layer", "inner nuclear layer", "outer plexiform layer", "outer nuclear layer", "ellipsoid zone", "outer segments", "interdigitation zone", "RPE/Bruch's membrane complex", "choroid and sclera"])
)}

function _plot_fill(rodconeloss){return(
rodconeloss.scale("color")
)}

function _60(plot_fill,layer_scale){return(
plot_fill.domain.map(d => layer_scale(d - 1))
)}

function _61(md){return(
md`### Experimental data wrangling`
)}

function _62(md){return(
md`I used these functions to experiment with data wrangling. See Mike Freeman's ["Data Wrangler"](https://observablehq.com/@observablehq/data-wrangler) notebook for details.`
)}

function _65(md){return(
md`### Values for the quiz`
)}

function* _laterality_random(new_quiz,d3)
{
  new_quiz;
  yield ["OD", "OS"][d3.randomInt(0, 2)(1)]
}


function* _rods_surviving_random(new_quiz,d3)
{
  new_quiz;
  yield Math.round((d3.randomUniform(0, 1)(1) * 100)) / 100;
}


function* _cones_surviving_random(new_quiz,d3)
{
  new_quiz;
  yield Math.round(d3.randomUniform(0, 1)(1) * 100) / 100;
}


function _cones_surviving_difference(cones_surviving_random,cones_surviving_guess){return(
(cones_surviving_random - cones_surviving_guess) * 100
)}

function _rods_surviving_difference(rods_surviving_random,rods_surviving_guess){return(
(rods_surviving_random - rods_surviving_guess) * 100
)}

function _thickness_modified_random(modify_thickness,thickness_data,rods_surviving_random,cones_surviving_random){return(
modify_thickness(thickness_data, rods_surviving_random, cones_surviving_random)
)}

function _thickness_modified_eye_random(thickness_modified_random,aq,laterality_random){return(
thickness_modified_random
  .filter(aq.escape(d => d["laterality"] == laterality_random))
)}

function _73(md){return(
md`The \`set\` function let's one input change the value of another input. I'm using it for the "Submit guess" and "New quiz" buttons.`
)}

function _75(md){return(
md`### Simulating a B-scan`
)}

function _76(md){return(
md`1. Get a single A-scan.
2. Get the unmodified segmentation at this position.
3. Get the modified segmentation at this position.
4. Draw a three column picture showing the mapping from A-scan voxel intensities, unmodified segmentation, and modified segmentation.
5. Work out the function to use these three sources as input data.
6. Plot the modified intensity data as a fourth column.`
)}

function _which_ascan(Inputs){return(
Inputs.range([1, 768], {step: 1, label: "Amount"})
)}

function _thickness_modified_eye_ascan(thickness_modified_eye,aq,which_ascan){return(
thickness_modified_eye.filter(aq.escape(d => d["ascan_id"] == which_ascan))
)}

function _ascan_domain(){return(
[1, 496]
)}

function _80(image_data,which_eye){return(
image_data.filter(d => d.laterality == which_eye)[0]["image"]
)}

function _81(bscan_od_image){return(
bscan_od_image
)}

function _plot_rodconeloss(Plot,x_domain,y_domain){return(
function(data, layers) {
  let data_no_vitreous = data
    .filter(d => d["surface_id"] > 1)
    .orderby("surface_id")

  return Plot.plot({
    x: {domain: x_domain },
    y: {domain: y_domain},  
    color: {
      type: "ordinal",
      scheme: "paired"
    },
    marks: [
      Plot.areaY(data_no_vitreous, {x: "x_mm", y1: y_domain[0], y2: "z_um", fill: "surface_id", fillOpacity: +layers}),
      Plot.line(data_no_vitreous, {x: "x_mm", y: "z_um", stroke: "surface_id"})
    ]
  })
}
)}

function _x_domain(d3,thickness_modified){return(
[d3.min(thickness_modified, d => d.x_mm), d3.max(thickness_modified, d => d.x_mm)]
)}

function _y_domain(){return(
[496 * 0.003872 * 1000, 0]
)}

function _85(md){return(
md`## Generating a modified B-scan`
)}

function _87(md){return(
md`### Working with the B-scan image data

Here's what we need:

1. The B-scan image as a 2D array.
2. The original surface positions as a 2D array. (Alternatively, we could use the original layer thicknesses.)
3. The modified layer thicknesses as a 2D array.

Alternatively, you could treat all the data as a giant 1D vector.

A column in the B-scan images is called an A-scan.

Here's what we'll do:

1. Create a new container to hold the result.
2. For each A-scan, run \`modify_vector(bscan[i,], segmentation[i, ], modified_thickness[i, ])\``
)}

function _bscan(image_data,which_eye){return(
image_data.filter(d => d.laterality == which_eye )[0].image
)}

function _bscan_random(image_data,laterality_random){return(
image_data.filter(d => d.laterality == laterality_random )[0].image
)}

function _modify_working(modify_vector){return(
function(data, thickness_data) {

  for(let ascan_id = 0; ascan_id < 768; ascan_id++) {

    // The A-scans begin at 1 not 0
    let surface_positions = 
        thickness_data.filter(d => d.ascan_id == ascan_id+1).map(d => d.z_original)
        .sort()

    // Add the position of the vitreous
    surface_positions.unshift(0)

    surface_positions.pop()
    
    let modified_thicknesses = 
      thickness_data.filter(d => d.ascan_id == ascan_id+1)
      .sort((a, b) => (a.surface_id > b.surface_id) ? 1 : -1)
      .map(d => d.thickness_mod_rounded_adjusted)
  
    let ascan_original = new Array(496)

    // Copy the original data
    for(let row_index = 0; row_index < 496; row_index++) {
      let array_index = 768*4*row_index + ascan_id*4

      ascan_original[row_index] = data[array_index]
    }

    // Modify the copied data
    // Confession: I'm not sure why I needed to reverse the vectors where I did--but it works.
    //             If someone wants to suggest how to make this simpler, please do!
    let ascan_modified = modify_vector(ascan_original.reverse(), surface_positions, modified_thicknesses.reverse()).reverse()

    // Copy the modified data back into the data object
    for(let row_index = 0; row_index < 496; row_index++) {
      let array_index = 768*4*row_index + ascan_id*4

      data[array_index + 0] = ascan_modified[row_index]
      data[array_index + 1] = ascan_modified[row_index]
      data[array_index + 2] = ascan_modified[row_index]
    }   
  }
}
)}

function _is_simulated(rods_surviving,cones_surviving){return(
(rods_surviving < 1) | (cones_surviving < 1)
)}

function _layers(Inputs){return(
Inputs.toggle({label: "Layers: On / Off"})
)}

function _rodconeloss(plot_rodconeloss,thickness_modified_eye,layers){return(
plot_rodconeloss(thickness_modified_eye, layers)
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["central_bscan_data@2.tsv", {url: new URL("./files/aa6a276a6ba08c2f167db1b4004ef90d2a8f6184c494562305086f7bcbeead92b37101fe9e11964354291874938ea0fb7b0de1012d0a657b6d09c0102438ff41.tsv", import.meta.url), mimeType: "text/tab-separated-values", toString}],
    ["central_bscan_od@2.png", {url: new URL("./files/42363388cf383f7a214f64391f02a2ff014c8d1c10758609966b2bfebd2323ac985f2ac4886359f9dda6810ad207a57232318c8f8d96c0d93843e594eaebaf1b.png", import.meta.url), mimeType: "image/png", toString}],
    ["central_bscan_os@1.png", {url: new URL("./files/04448afec60224c9eb6531089b4fc4c208d2967d3f878b5e9fef52fa92b147764a029185c1da4bf7b6d8b27e6ef21a2c9cdfb3d60e249e7283a5953ce75b24dc.png", import.meta.url), mimeType: "image/png", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("bscan_canvas_segmentation")).define("bscan_canvas_segmentation", ["html","image_data","which_eye","d3","DOM","thickness_modified_eye","y_domain","show_layers","show_bscan","modify_working","is_simulated"], _bscan_canvas_segmentation);
  main.variable(observer("legend")).define("legend", ["Swatches","d3","plot_fill","layer_scale"], _legend);
  main.variable(observer()).define(["html","rods_surviving","cones_surviving"], _4);
  main.variable(observer("viewof show_layers")).define("viewof show_layers", ["Inputs"], _show_layers);
  main.variable(observer("show_layers")).define("show_layers", ["Generators", "viewof show_layers"], (G, _) => G.input(_));
  main.variable(observer("viewof rods_surviving_percentage")).define("viewof rods_surviving_percentage", ["Inputs"], _rods_surviving_percentage);
  main.variable(observer("rods_surviving_percentage")).define("rods_surviving_percentage", ["Generators", "viewof rods_surviving_percentage"], (G, _) => G.input(_));
  main.variable(observer("viewof cones_surviving_percentage")).define("viewof cones_surviving_percentage", ["Inputs"], _cones_surviving_percentage);
  main.variable(observer("cones_surviving_percentage")).define("cones_surviving_percentage", ["Generators", "viewof cones_surviving_percentage"], (G, _) => G.input(_));
  main.variable(observer("viewof which_eye")).define("viewof which_eye", ["Inputs"], _which_eye);
  main.variable(observer("which_eye")).define("which_eye", ["Generators", "viewof which_eye"], (G, _) => G.input(_));
  main.variable(observer("viewof show_bscan")).define("viewof show_bscan", ["Inputs"], _show_bscan);
  main.variable(observer("show_bscan")).define("show_bscan", ["Generators", "viewof show_bscan"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], _10);
  main.variable(observer()).define(["bscan_canvas","bscan_random","thickness_modified_eye_random"], _11);
  main.variable(observer("viewof new_quiz")).define("viewof new_quiz", ["Inputs","set","viewof submit_guess"], _new_quiz);
  main.variable(observer("new_quiz")).define("new_quiz", ["Generators", "viewof new_quiz"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], _13);
  main.variable(observer("viewof rods_surviving_guess_percentage")).define("viewof rods_surviving_guess_percentage", ["Inputs"], _rods_surviving_guess_percentage);
  main.variable(observer("rods_surviving_guess_percentage")).define("rods_surviving_guess_percentage", ["Generators", "viewof rods_surviving_guess_percentage"], (G, _) => G.input(_));
  main.variable(observer("viewof cones_surviving_guess_percentage")).define("viewof cones_surviving_guess_percentage", ["Inputs"], _cones_surviving_guess_percentage);
  main.variable(observer("cones_surviving_guess_percentage")).define("cones_surviving_guess_percentage", ["Generators", "viewof cones_surviving_guess_percentage"], (G, _) => G.input(_));
  main.variable(observer("viewof submit_guess")).define("viewof submit_guess", ["Inputs"], _submit_guess);
  main.variable(observer("submit_guess")).define("submit_guess", ["Generators", "viewof submit_guess"], (G, _) => G.input(_));
  main.variable(observer()).define(["submit_guess","md","rods_surviving_random","rods_surviving_difference","cones_surviving_random","cones_surviving_difference"], _17);
  main.variable(observer()).define(["md"], _18);
  main.variable(observer()).define(["md"], _19);
  main.variable(observer()).define(["md"], _20);
  main.variable(observer()).define(["tex"], _21);
  main.variable(observer()).define(["md"], _22);
  main.variable(observer("rods_surviving")).define("rods_surviving", ["rods_surviving_percentage"], _rods_surviving);
  main.variable(observer("cones_surviving")).define("cones_surviving", ["cones_surviving_percentage"], _cones_surviving);
  main.variable(observer("rods_surviving_guess")).define("rods_surviving_guess", ["rods_surviving_guess_percentage"], _rods_surviving_guess);
  main.variable(observer("cones_surviving_guess")).define("cones_surviving_guess", ["cones_surviving_guess_percentage"], _cones_surviving_guess);
  const child1 = runtime.module(define1);
  main.import("aq", child1);
  const child2 = runtime.module(define2);
  main.import("vl", child2);
  main.variable(observer()).define(["md"], _29);
  main.variable(observer()).define(["md"], _30);
  main.variable(observer()).define(["FileAttachment"], _31);
  main.variable(observer()).define(["FileAttachment"], _32);
  main.variable(observer("bscan_os_image")).define("bscan_os_image", ["FileAttachment"], _bscan_os_image);
  main.variable(observer("bscan_od_image")).define("bscan_od_image", ["FileAttachment"], _bscan_od_image);
  main.variable(observer("image_data")).define("image_data", ["bscan_od_image","FileAttachment","bscan_os_image"], _image_data);
  main.variable(observer("image_data_eye")).define("image_data_eye", ["aq","image_data","which_eye"], _image_data_eye);
  main.variable(observer("simulated_bscan")).define("simulated_bscan", ["bscan_canvas","bscan","thickness_modified_eye","show_bscan","is_simulated"], _simulated_bscan);
  main.variable(observer("current_bscan_data")).define("current_bscan_data", ["simulated_bscan"], _current_bscan_data);
  main.variable(observer("data_file")).define("data_file", ["FileAttachment"], _data_file);
  main.variable(observer("bscan_canvas")).define("bscan_canvas", ["DOM","modify_working"], _bscan_canvas);
  main.variable(observer("thickness_data")).define("thickness_data", ["d3","data_file"], _thickness_data);
  main.variable(observer("modify_thickness")).define("modify_thickness", ["aq","op"], _modify_thickness);
  main.variable(observer("thickness_modified")).define("thickness_modified", ["modify_thickness","thickness_data","rods_surviving","cones_surviving"], _thickness_modified);
  main.variable(observer("thickness_modified_eye")).define("thickness_modified_eye", ["thickness_modified","aq","which_eye"], _thickness_modified_eye);
  main.variable(observer()).define(["md"], _45);
  main.variable(observer()).define(["md"], _46);
  main.variable(observer("x")).define("x", ["d3","thickness_data","margin","width"], _x);
  main.variable(observer("x_mm")).define("x_mm", ["d3","thickness_data","margin","width"], _x_mm);
  main.variable(observer("y")).define("y", ["d3","height","margin"], _y);
  main.variable(observer("color_surface")).define("color_surface", ["d3"], _color_surface);
  main.variable(observer()).define(["md"], _51);
  main.variable(observer()).define(["md"], _52);
  main.variable(observer("height")).define("height", _height);
  main.variable(observer("margin")).define("margin", _margin);
  main.variable(observer("surface_ids")).define("surface_ids", _surface_ids);
  main.variable(observer()).define(["md"], _56);
  main.variable(observer("layer_scale")).define("layer_scale", ["d3"], _layer_scale);
  main.variable(observer("plot_fill")).define("plot_fill", ["rodconeloss"], _plot_fill);
  const child3 = runtime.module(define3);
  main.import("Legend", child3);
  main.import("Swatches", child3);
  main.variable(observer()).define(["plot_fill","layer_scale"], _60);
  main.variable(observer()).define(["md"], _61);
  main.variable(observer()).define(["md"], _62);
  const child4 = runtime.module(define4);
  main.import("Copier", child4);
  const child5 = runtime.module(define5);
  main.import("Wrangler", child5);
  main.import("op", child5);
  main.variable(observer()).define(["md"], _65);
  main.variable(observer("laterality_random")).define("laterality_random", ["new_quiz","d3"], _laterality_random);
  main.variable(observer("rods_surviving_random")).define("rods_surviving_random", ["new_quiz","d3"], _rods_surviving_random);
  main.variable(observer("cones_surviving_random")).define("cones_surviving_random", ["new_quiz","d3"], _cones_surviving_random);
  main.variable(observer("cones_surviving_difference")).define("cones_surviving_difference", ["cones_surviving_random","cones_surviving_guess"], _cones_surviving_difference);
  main.variable(observer("rods_surviving_difference")).define("rods_surviving_difference", ["rods_surviving_random","rods_surviving_guess"], _rods_surviving_difference);
  main.variable(observer("thickness_modified_random")).define("thickness_modified_random", ["modify_thickness","thickness_data","rods_surviving_random","cones_surviving_random"], _thickness_modified_random);
  main.variable(observer("thickness_modified_eye_random")).define("thickness_modified_eye_random", ["thickness_modified_random","aq","laterality_random"], _thickness_modified_eye_random);
  main.variable(observer()).define(["md"], _73);
  const child6 = runtime.module(define6);
  main.import("set", child6);
  main.variable(observer()).define(["md"], _75);
  main.variable(observer()).define(["md"], _76);
  main.variable(observer("viewof which_ascan")).define("viewof which_ascan", ["Inputs"], _which_ascan);
  main.variable(observer("which_ascan")).define("which_ascan", ["Generators", "viewof which_ascan"], (G, _) => G.input(_));
  main.variable(observer("thickness_modified_eye_ascan")).define("thickness_modified_eye_ascan", ["thickness_modified_eye","aq","which_ascan"], _thickness_modified_eye_ascan);
  main.variable(observer("ascan_domain")).define("ascan_domain", _ascan_domain);
  main.variable(observer()).define(["image_data","which_eye"], _80);
  main.variable(observer()).define(["bscan_od_image"], _81);
  main.variable(observer("plot_rodconeloss")).define("plot_rodconeloss", ["Plot","x_domain","y_domain"], _plot_rodconeloss);
  main.variable(observer("x_domain")).define("x_domain", ["d3","thickness_modified"], _x_domain);
  main.variable(observer("y_domain")).define("y_domain", _y_domain);
  main.variable(observer()).define(["md"], _85);
  const child7 = runtime.module(define7);
  main.import("modify_vector", child7);
  main.import("inverse_rle", child7);
  main.import("compute_thickness", child7);
  main.variable(observer()).define(["md"], _87);
  main.variable(observer("bscan")).define("bscan", ["image_data","which_eye"], _bscan);
  main.variable(observer("bscan_random")).define("bscan_random", ["image_data","laterality_random"], _bscan_random);
  main.variable(observer("modify_working")).define("modify_working", ["modify_vector"], _modify_working);
  main.variable(observer("is_simulated")).define("is_simulated", ["rods_surviving","cones_surviving"], _is_simulated);
  main.variable(observer("viewof layers")).define("viewof layers", ["Inputs"], _layers);
  main.variable(observer("layers")).define("layers", ["Generators", "viewof layers"], (G, _) => G.input(_));
  main.variable(observer("rodconeloss")).define("rodconeloss", ["plot_rodconeloss","thickness_modified_eye","layers"], _rodconeloss);
  return main;
}
