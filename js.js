$(document).on('click', 'li', function () {
  var target = $(this).next();
  if (target && target.is('ul')) {
    $(target).toggle();
    return false;
  }

  var children = $(this).children()
  if (children.length === 0) {
    return false;
  }

  // switch (children[0].tagName) {
  //   case "P":
  //     $(children[2]).toggle()
  //     ulOpenOrClose(this)
  //     break;
  //   case "UL":
  //     $(children[0]).toggle()
  //     ulOpenOrClose(this)
  //     break
  //   case "SPAN":
  //     $(children[3]).toggle()
  //     break
  //   default:
  //     console.log(children[0].tagName)
  // }

  return false
})

$(document).on('dragstart',function (ev) {
  let id;
  switch (ev.target.tagName) {
    case "LI":
      id = ev.target.id;
      break;
    case "SPAN":
    case "UL":
      id = ev.target.parentElement.id;
      break;
  }
  ev.originalEvent.dataTransfer.setData("id",id)
})

function ulOpenOrClose(target) {
  console.log(target.classList)
  if (target.classList.contains("li-open")) {
    target.classList.remove("li-open")
    target.classList.add("li-close")
  } else {
    target.classList.remove("li-close")
    target.classList.add("li-open")
  }
}


function getLogicRelation() {
  return `
<select name="logic">
<option >逻辑关系</option>
<option value="and">与</option>
<option value="or">或</option>
<option value="not">非</option>
</select>`;
}

function setCalculateSymbol(type) {
  var lis ;
  if (!typeSymbols[type]){
    alert("无效的类型: "+ type)
    return
  }
  for (let symbol of typeSymbols[type]){
    lis += `<option value="${symbol}">${symbol}</option>`
  }
  return `

<select name="symbol">
<option >运算</option>${lis}
</select>`;
}

function setTagType() {
  return `
<select name="type" >
<option >数据类型</option>
<option value="int">number</option>
<option value="string">字符串</option>
<option value="array">数组</option>
</select>`;
}

function setValue() {
  return '值<input type="text" name="value">'
}

// function subTags() {
//   return '<li class="subTags li-open">子规则<ul></ul></li>'
// }

var types = ["int", "string", "array", "datetime", "timestamp", "enum"];
var menu = [
  {
    "name": "个人信息",
    "tag": "userProfile",
    "id": 1,
    "sub": [{
      "name": "年龄",
      "tag": "age",
      "id": 1,
      "type": "int",
      "sub": [],
    },
      {
      "name": "性别",
      "tag": "gender",
      "id": 2,
      "type": "int",
        "sub": [],
    }, {
      "name": "城市",
      "tag": "city",
      "id": 3,
      "type": "int",
        "sub": [],
    },

    ],
  },
  {
    "name": "爱好",
    "tag": "hobby",
    "id": 4,
    "type":"array",
    "sub": [],
  }
];
var typeSymbols = {
  "int":[">",">=","=","<=","<"],
  "string":["=","!=","contains","in","not in"],
  "array":["in","not in","=","!="],
}

function setTags(menu, ele) {
  if (!menu || menu.length === 0) {
    return
  }

  for (node of menu) {
    if (node.sub.length === 0) {
      ele.append(`<li draggable="true" class="menu" id="${getUniqueID()}" data-value='${node.name}|${node.tag}|${node.type}'><i class=""></i><span>${node.name}</span></span></li>`)
      continue
    } else {
      ele.append(`<li class="li-dir unselectable"> ${node.name} </li>`)
    }

    ele.append('<ul class="sidebar "></ul>')
    last = ele.children().last()
    setTags(node.sub, last)
    ele.children().last().toggle()
  }
}

$("document").ready(function () {
  setTags(menu, $("#menu ul"))
});

function allowDrop(ev) {
  if (!checkAllowDrop(ev)) {
    return false
  }

  ev.preventDefault();
}

function drop(ev) {
  ev.preventDefault();
  $(ev.target).css({"border": ""})
  var id = ev.dataTransfer.getData("id");

  let originalElement = document.getElementById(id)
  if (originalElement.className !== "menu"){
    if (ev.target.className === "tag-ul"){
      ev.target.append(originalElement)
    }else{
      ev.target.children[0].append(originalElement)
    }
    ulChange()
    return
  }

  var str = originalElement.getAttribute("data-value")
  data = str.split('|')
  name = data[0]
  tag = data[1]
  type = data[2]
  elems = `
    <span draggable="false">${name}</span> <span hidden class="tagName">${tag}</span>`
    + getLogicRelation()
    + setCalculateSymbol(type)
    + setTagType()
    + setValue()
    // + subTags()
    + `<span class="del" draggable="false" onclick="delLi(this)">删除</span>`


  var classList = ev.target.classList
  if (classList.contains("subTags")) {
    let subTags = $(ev.target)
    $(subTags.children()[0]).append(`<li draggable="true" id="${getUniqueID()}" class="tag li-open"> ${elems} </li>`);
  } else if (classList.contains("tag-ul")) {
    $(ev.target).append(`<li class="tag li-open" draggable="true" id="${getUniqueID()}"> ${elems} </li>`);
  }

  ulChange()
}

function delLi(ele) {
  $(ele).parent().remove()
  ulChange()
}

function ulChange() {
  console.log("tag change")
  var jsonDiv = $("textarea")
  var lis = $(".tag-ul").children()
  if (!lis) {
    jsonDiv.value = '[]'
    return
  }

  result = generateJson(lis)
  console.log(result)
  jsonDiv.val(JSON.stringify(result, null, 2));
}

function generateJson(lis) {
  var result = [];

  for (var i = 0; i < lis.length; i++) {
    var li = $(lis[i])

    var item = {
      tag: li.children(".tagName")[0].innerHTML,
      logic: li.children("[name='logic']")[0].value,
      symbol: li.children("[name='symbol']")[0].value,
      type: li.children("[name='type']")[0].value,
      value: li.children("[name='value']")[0].value,
      subTags: []
    }

    switch (item.type) {
      case "int":
        item.value = parseInt(item.value, 10)
        break;
      case "array":
        if (item.value[0] === '[' || item.value[item.value.length - 1] === ']') {
          item.value = item.value.substr(1, item.value.length - 2).split(',')
          break;
        }
        break;
      default:

    }


    // if (subLis.length) {
    //   item.subTags = generateJson(subLis)
    // }

    result.push(item)
  }

  return result
}

function dragenter(ev) {
  if (!checkAllowDrop(ev)) {
    return false
  }
  ev.preventDefault();
  $(ev.target).css({"border": "solid red 1px"})
}

function dragleave(ev) {
  $(ev.target).css({"border": ""})
}

function getLiTagFieldValue(li) {
  return $(li).children()[0].value
}

function checkAllowDrop(ev) {
  var classList = ev.target.classList
  return classList.contains("subTags") || classList.contains("tag-ul")
}

var uniqueID = 0
function getUniqueID() {
  uniqueID++
  return "id_"+uniqueID.toString()
}
