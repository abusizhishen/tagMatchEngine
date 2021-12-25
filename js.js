$(document).on('click', 'li', function () {
  target = $(this).next();
  if (target && target.is('ul')) {
    $(target).toggle();
  }
})


var menu = [
  {
    "name": "个人信息",
    "id": 1,
    "sub": [{
      "name": "爱好",
      "id": 1,
      "sub": [],
    },{
      "name": "技能",
      "id": 1,
      "sub": [],
    },],
  },
  {
    "name": "银行卡",
    "id": 2,
    "sub": [
      {
        "name": "中国银行",
        "id": 1,
        "sub": [],
      },

      {
        "name": "北京银行",
        "id": 1,
        "sub": [],
      }
    ],
  },
  {
    "name": "社会关系",
    "id": 1,
    "sub": [

      {
        "name": "王五",
        "id": 1,
        "sub": [],
      },
      {
        "name": "李四",
        "id": 1,
        "sub": [],
      }
    ],
  },
  {
    "name": "居住地",
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
      ele.append('<li draggable="true" ondragstart="drag(event)" data-value="' + node.name + '">' + node.name + '</li>')
      continue
    } else {
      ele.append('<li >' + node.name + '</li>')
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
  var data = ev.dataTransfer.getData("value");
  elems = data + getLogicRelation()+setCalculateSymbol()+setTagType()
  $(ev.target).append(`<li><div ondrop="drop(event)"> ${elems} </div></li>`);

}

function drag(ev) {
  value = $(ev.target).attr("data-value");
  ev.dataTransfer.setData("value", value);
}

function getLogicRelation() {
  return `<select name="logic">
<option ></option>
<option value="and">与</option>
<option value="or"><</option>
<option value="not">not</option>
</select>`;
}

function setCalculateSymbol() {
  return `<select name="symbol">
<option ></option>
<option value="1">></option>
<option value="2"><</option>
<option value="3">=</option>
</select>`;
}

function setTagType() {
  return `<select name="type">
<option ></option>
<option value="int">int</option>
<option value="string">string</option>
<option value="array">array</option>
</select>`;
}
