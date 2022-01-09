# js基础

这里方代码实现，如果想看基础总结，查看`xmind`文件夹下的`js`文件

![js脑图](../images/review/2.png)

## instanceof 的实现

```js
function myInstance (left, right) {
  // 获取对象的原型
  let proto = Object.getPrototypeOf(left)
  // 获取构造函数的prototype
  let prototype = right.prototype

  // 判断构造函数的prototype 对象是否在对象的原型链上
  while (true) {
    if (!proto) return false
    if (proto === prototype) return true
    // 如果没有找到就继续从其原型上找，
    proto = Object.getPrototypeOf(proto)
  }
}
```

## new 操作符实现原理

这里去除一些边际判断 只关注核心

```js
function objectFactory(constructor, ...rest) {
  // 创建一个空对象，对象的原型为构造函数的prototype
  let newObj  = Object.create(constructor.prototype)
  // 将this 指向这个新对象，并执行函数
  constructor.apply(newObj, rest)
  // 返回新对象
  return newObj
}
```

## ajax

```js
const SERVER_URL = "/server";
let xhr = new XMLHttpRequest();
// 创建 Http 请求
xhr.open("GET", url, true);
// 设置状态监听函数
xhr.onreadystatechange = function() {
  if (this.readyState !== 4) return;
  // 当请求成功时
  if (this.status === 200) {
    handle(this.response);
  } else {
    console.error(this.statusText);
  }
};
// 设置请求失败时的监听函数
xhr.onerror = function() {
  console.error(this.statusText);
};
// 设置请求头信息
xhr.responseType = "json";
xhr.setRequestHeader("Accept", "application/json");
// 发送 Http 请求
xhr.send(null);
```

## 原型修改、重写

```js
function Person(name) {
    this.name = name
}
// 修改原型
Person.prototype.getName = function() {}
var p = new Person('hello')
console.log(p.__proto__ === Person.prototype) // true
console.log(p.__proto__ === p.constructor.prototype) // true
// 重写原型
Person.prototype = {
    getName: function() {}
}
var p = new Person('hello')
console.log(p.__proto__ === Person.prototype)        // true
console.log(p.__proto__ === p.constructor.prototype) // false
```

下面`p`的原型被修改了，`p.constructor` 不指向`Person`。那么只要修改回来就好了

```js
Person.prototype = {
    getName: function() {}
}
var p = new Person('hello')
p.constructor = Person
console.log(p.__proto__ === Person.prototype)        // true
console.log(p.__proto__ === p.constructor.prototype) // true
```

## 原型链指向

**要牢记 `__proto__`是浏览器的实现，它是用来访问`prototype`的。**

```js
p.__proto__  // Person.prototype
Person.prototype.__proto__  // Object.prototype
p.__proto__.__proto__ //Object.prototype
p.__proto__.constructor.prototype.__proto__ // Object.prototype
Person.prototype.constructor.prototype.__proto__ // Object.prototype
p1.__proto__.constructor // Person
Person.prototype.constructor  // Person
```

## 如何获得对象非原型链上的属性？

```js
function iterate(obj){
  var res=[];
  for(var key in obj){
      if(obj.hasOwnProperty(key))
          res.push(key+': '+obj[key]);
  }
  return res;
} 
```

## 继承的几种方式

- 原型链继承

缺点: 无法实现多继承

```js
//父类型
function Person(name, age) {
   this.name = name,
   this.age = age,
   this.play = [1, 2, 3]
   this.setName = function () { }
}
Person.prototype.setAge = function () { }
//子类型
function Student(price) {
   this.price = price
   this.setScore = function () { }
}
Student.prototype = new Person() // 子类型的原型为父类型的一个实例对象
var s1 = new Student(15000)
var s2 = new Student(14000)
console.log(s1,s2)
```

- 借用构造函数继承

缺点：无法继承原型上的方法

```js
function Person(name, age) {
  this.name = name,
  this.age = age,
  this.setName = function () {}
}
Person.prototype.setAge = function () {}
function Student(name, age, price) {
  Person.call(this, name, age)  // 相当于: this.Person(name, age)
  this.price = price
}
var s1 = new Student('Tom', 20, 15000)
```

- 组合继承

使用了`es5`的语法，`Object.create()`，将子类的原型的原型指向了父类的原型，并且它的构造函数重新指向自己
没有副作用的方式

```js
function Person(name, age) {
  this.name = name,
  this.age = age
}
Person.prototype.setAge = function () {
  console.log("111")
}
function Student(name, age, price) {
  Person.call(this, name, age)
  this.price = price
  this.setScore = function () {}
}
Student.prototype = Object.create(Person.prototype)//核心代码
Student.prototype.constructor = Student//核心代码
var s1 = new Student('Tom', 20, 15000)
console.log(s1 instanceof Student, s1 instanceof Person) // true true
console.log(s1.constructor) //Student
console.log(s1)
```