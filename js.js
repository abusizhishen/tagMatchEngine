$(document).on('click', 'li', function () {
  var target = $(this).next();
  if (target && target.is('ul')) {
    $(target).toggle();
    return false;
  }

  var children = $(this).children()
  //console.log(this.innerText)
  if (children.length=== 0) {
    return false;
  }

  switch (children[0].tagName) {
    case "P":
      $(children[2]).toggle()
      ulOpenOrClose(this)
      break;
    case "UL":
      $(children[0]).toggle()
      ulOpenOrClose(this)
      break
    default:
      console.log(children[0].tagName)
  }

  return false
})

function ulOpenOrClose(target) {
  console.log(target.classList)
  if (target.classList.contains("li-open")){
    target.classList.remove("li-open")
    target.classList.add("li-close")
  }else{
    target.classList.remove("li-close")
    target.classList.add("li-open")
  }
}


function getLogicRelation() {
  return `
<li>逻辑关系
<select name="logic">
<option ></option>
<option value="and">与</option>
<option value="or"><</option>
<option value="not">not</option>
</select>
</li>`;
}

function setCalculateSymbol() {
  return `
<li>运算
<select name="symbol">
<option ></option>
<option value=">">></option>
<option value="<"><</option>
<option value="=">=</option>
</select>
</li>`;
}

function setTagType() {
  return `
<li>数据类型
<select name="type" >
<option ></option>
<option value="int">int</option>
<option value="string">string</option>
<option value="array">array</option>
</select>
</li>`;
}

function setValue(){
  return '<li class="value">值<input type="text"></li>'
}

function subTags(){
  return '<li class="subTags li-open">子规则<ul></ul></li>'
}

var menu = [
  {
    "name": "个人信息",
    "tag": "userProfile",
    "id": 1,
    "sub": [{
      "name": "爱好",
      "tag": "hobby",
      "id": 1,
      "sub": [],
    }, {
      "name": "技能",
      "tag": "skill",
      "id": 1,
      "sub": [],
    },],
  },
  {
    "name": "银行卡",
    "tag": "bankCards",
    "id": 2,
    "sub": [
      {
        "name": "中国银行",
        "tag": "chineseBank",
        "id": 1,
        "sub": [],
      },

      {
        "name": "北京银行",
        "tag": "beijingBank",
        "id": 1,
        "sub": [],
      }
    ],
  },
  {
    "name": "居住地",
    "tag": "address",
    "id": 1,
    "sub": [],
  }
];

function setTags(menu, ele) {
  if (!menu || menu.length === 0) {
    return
  }

  for (node of menu) {
    if (node.sub.length === 0) {
      ele.append(`<li draggable="true" ondragstart="drag(event)" data-value='${node.name}|${node.tag}'><i class=""></i><span>${node.name}</span></span></li>`)
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
  setTags(menu, $("#left ul"))
});

function allowDrop(ev) {
  if (!checkAllowDrop(ev)){
    return false
  }

  ev.preventDefault();
}

function drop(ev) {
  ev.preventDefault();
  $(  ev.target).css({"border":""})
  var str = ev.dataTransfer.getData("value");

  data = str.split('|')
  name=data[0]
  tag = data[1]
  elems = `
    ${name} <p hidden>${tag}</p><div class="del" onclick="delLi(this)">删除</div><ul draggable="true">`
    + getLogicRelation()
    + setCalculateSymbol()
    + setTagType()
    + setValue()
    + subTags()
    +"</ul>"
  switch (ev.target.className){
    case "subTags":
      let subTags = $(ev.target)
      $(subTags.children()[0]).append(`<li> ${elems} </li>`);
      break
    case "tag-ul":
      $(ev.target).append(`<li class="tag li-open"> ${elems} </li>`);
    break;
    default:
      console.log(ev.target.className)
  }


  ulChange()
}

function drag(ev) {
  value = $(ev.target).attr("data-value");
  ev.dataTransfer.setData("value", value);
  //ev.dataTransfer.setDragImage(image, xOffset, yOffset);
}


function delLi(ele) {
  $(ele).parent().remove()
  ulChange()
}

function ulChange() {
  var jsonDiv = $("#json")
  var lis = $(".tag-ul").children()
  if (!lis) {
    jsonDiv.value = '[]'
    return
  }

  result = generateJson(lis)

  jsonDiv.val(JSON.stringify(result, null, 2));
}

function generateJson(lis) {
  var result = [];

  for (i = 0; i < lis.length; i++) {
    li = $(lis[i])
    children = li.children()
    var tag = children[0].innerText
    var ul = children[2]
    var fields = $(ul).children()
    var fieldIdx = 0

    var item = {
      tag: tag,
      logic: getLiTagFieldValue(fields[fieldIdx++]),
      symbol: getLiTagFieldValue(fields[fieldIdx++]),
      type: getLiTagFieldValue(fields[fieldIdx++]),
      value: getLiTagFieldValue(fields[fieldIdx++]),
      subTags: []
    }

    switch (item.type) {
    case "int":
      item.value = parseInt(item.value,10)
        break;
      case "array":
        if (item.value[0] === '['|| item.value[item.value.length - 1] === ']'){
          item.value = item.value.substr(1, item.value.length-2).split(',')
          break;
        }
        break;
      default:

    }

    li = $(fields[fieldIdx])
    subUl = $(li).children()[0]
    lis = $(subUl).children()
    if (lis.length){
      item.subTags = generateJson(lis)
    }

    result.push(item)
  }

  return result
}

function dragenter(ev) {
  if (!checkAllowDrop(ev)){
    return false
  }
  ev.preventDefault();
  $(  ev.target).css({"border":"solid red 1px"})
}

function dragleave(ev) {
  //ev.preventDefault();

  $(  ev.target).css({"border":""})
}

function getLiTagFieldValue(li) {
  return $(li).children()[0].value
}

function checkAllowDrop(ev) {
  switch (ev.target.className){
    case "subTags"  :
    case "tag-ul":
      return true
    default:
      return false;
  }
}
