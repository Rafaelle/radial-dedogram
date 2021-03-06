// set the dimensions and margins of the graph
var width = 900;
var height = 890;
var radius = width / 2; // radius of the dendrogram
var margin = 250;

window.onload = function(){

  // append the svg object to the body of the page
  var svg = d3.select("#org_details")
    .append("svg")
    .attr("id", "svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + radius + "," + radius + ")");

    //svg.select("#arrow-departament-detail").style("display","none");



  var colab = [];
  d3.json("colaboradores.json", function(d) {
    colab = d.tree;
  });
  // read json departamentos
  d3.json("departamentos.json", function(d) {
    var data = d.tree;

    // Create the cluster layout:
    var cluster = d3.cluster()
      .size([360, radius - margin]); // 360 means whole circle. radius - 60 means 60 px of margin around dendrogram

    // Give the data to this cluster layout:
    var root = d3.hierarchy(data, function(d) {
      return d.children;
    });
    cluster(root);

    // Features of the links between nodes:
    var linksGenerator = d3.linkRadial()
      .angle(function(d) {
        return d.x / 180 * Math.PI;
      })
      .radius(function(d) {
        return d.y;
      });

    // Add the links between nodes:
    svg.selectAll('path')
      .data(root.links())
      .enter()
      .append('path')
      .attr("d", linksGenerator)
      .style("fill", 'none')
      .attr("stroke", '#ccc');

    // Add a circle for each node.
    var nodeGroups = svg.selectAll("g")
      .data(root.descendants())
      .enter()
      .append("g")
      .attr("transform", function(d) {
        return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")";
      });

    nodeGroups.append("circle")
      .attr("class", "cicle-org")
      .attr("r", 7)
      .attr("opacity", 1)
      .on("click", function(d) {
        if (d.data.id !== "2" && d.data.id !== "3") {
          //svg.select("#arrow-departament-detail").style("visibility","show");
          collaborators_department(d.data, colab);
        }
      });

    nodeGroups.append('svg:text')
      .attr("class", "text-nodeGroups jumbotron")
      .attr('x', 0)
      .attr('y', 0)
      .attr("text-anchor", function(d) {
        return d.x < 180 ? "start" : "end";
      })
      .attr("transform", function(d) {
        return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)";
      })
      .append('svg:tspan')
      .attr('x', 0)
      .attr('dy', 5)
      .text(function(d) {
        return breakLine(d.data.department)[0];
      })
      .append('svg:tspan')
      .attr('x', 0)
      .attr('dy', 20)
      .text(function(d) {
        return breakLine(d.data.department)[1];
      })

        nodeGroups.selectAll("circle")
          .on("mouseover", function(d, i) {
            if (d.data.id !== "2" && d.data.id !== "3") {
              d3.select(this)
              .attr("r", 12)
              .style("fill", 'black');
            }
          });

        nodeGroups.selectAll("circle")
          .on("mouseout", function(d, i) {
            if (d.data.id !== "2" && d.data.id !== "3") {
              if (d.data.id !== "2" && d.data.id !== "3") {
                d3.select(this)
                .attr("r", 8)
                .style("fill", '#69b3a2');
              }
            }
          })
  });
};


function collaborators_department(department, colab) {
  d3.select("#department_container").select("h3").html(department.department);
  //  svg.select("#icon_table_colab").style("visibility", "hidden");


  var dpt  = d3.select("#departament_detail");
  dpt.selectAll("*").remove();

  colab.collaborators.filter(function(d) {
    if (d.dept_id === department.id) {
      //  svg.select("#icon_table_colab").style("visibility", "visible");
      update_person(dpt, d, department.department);

    }
  });

}

function update_person(dpt, person) {
  dpt.append("div")
    .attr("class", "person_detail")
    .html(function() {
      return make_person_details(person);
    });
}


function breakLine(text_to_break) {
  var res = text_to_break.substring(0, 22); // "72"
  var teste = text_to_break.substring(22).split(/ (.*)/);
  return [res + teste[0], teste[1]];
}

function make_person_details(person) {

  var html = "<div class='card bg-light'>";

  if (person.img != "" && person.img != undefined) {
    html += "<img class='card-img ' src=" + person.img + "alt='card image'>";
  } else {
    html += "<img  class= 'card-img ' src='icons/do-utilizador.png' alt='card image'>";
  }

  html += "<div class='card-body'><h5 class='card-title'>" + person.name + "</h5><hr/>";

  if (person.post != "" && person.post != undefined) {
    html += "<p class='card-text'><b>Cargo:</b> " + person.post + "</p>";
  }

  if (person.occupation_area != "" && person.occupation_area != undefined) {
    html += "<p class='card-text'><b>Área:</b> " + person.occupation_area + "</p>";
  }

  html += "<p class='card-text'><b>Telefone:</b> " + person.phone + "</p>" +
    "<p class='card-text'><b>E-mail:</b> " + person.email + "</p>";
    html += "</div>";


  if (person.lattes != "" && person.lattes != undefined) {
    html += "<div class='card-footer'> <a class='card-link' href=" + person.lattes + " target='_blank'>" +
      "<img class='img-lattes' src='icons/lattes_logo.png'/> <em>&nbsp;Curriculo Lattes</em></a></p>";
  }

  html += "</div>";

  return html;
}
