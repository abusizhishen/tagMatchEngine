$(document).on('click', 'li', function () {
  target = $(this).next();
  if (target && target.is('ul')) {
    $(target).toggle();
  }
})


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
<select name="type">
<option ></option>
<option value="int">int</option>
<option value="string">string</option>
<option value="array">array</option>
</select>
</li>`;
}

function setValue(){
  return '<li>值<input type="text"></li>'
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
      ele.append(`<li draggable="true" ondragstart="drag(event)" data-value='` + node.name + '|' + node.tag + `'>` + node.name + '</li>')
      continue
    } else {
      ele.append('<li class="li-dir">' + node.name + '</li>')
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
  ev.preventDefault();
}

function drop(ev) {
  ev.preventDefault();
  console.log(  ev.target)
  $(  ev.target).css({"border":""})
  var str = ev.dataTransfer.getData("value");

  data = str.split('|')
  name=data[0]
  tag = data[1]
  elems = `
    ${name} <p hidden>${tag}</p><div class="del" onclick="delLi(this)">删除</div><ul>`
    + getLogicRelation()
    + setCalculateSymbol()
    + setTagType()
    + setValue()
    +"</ul>"
  $(ev.target).append(`
<li
ondrop="drop(event)"
ondragover="allowDrop(event)"
ondragenter="dragenter(event)"
ondragleave="dragleave(event)"
class="item"
> ${elems} </li>`);

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
  var result = [];

  for (i = 0; i < lis.length; i++) {
    li = $(lis[i])
    children = li.children()
    var tag = children[0].innerText
    console.log(tag)
    var ul = children[2]
    var fields = $(ul).children()
    var fieldIdx = 0

    console.log(fields)
    item = {
      tag: tag,
      logic: getLiTagFieldValue(fields[fieldIdx++]),
      symbol: getLiTagFieldValue(fields[fieldIdx++]),
      type: getLiTagFieldValue(fields[fieldIdx++]),
      value: getLiTagFieldValue(fields[fieldIdx++]),
    }

    //console.log(item)
    //console.log(li)

    result.push(item)
  }

  jsonDiv.val(JSON.stringify(result, null, 2));
}

function getChildrenTags() {

}

function dragenter(ev) {
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
