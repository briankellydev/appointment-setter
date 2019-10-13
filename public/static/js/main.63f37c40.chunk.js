(this["webpackJsonpappointment-setter-frontend"]=this["webpackJsonpappointment-setter-frontend"]||[]).push([[0],{39:function(e,t,a){},58:function(e,t,a){e.exports=a(88)},63:function(e,t,a){},64:function(e,t,a){},87:function(e,t,a){},88:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),s=a(7),o=a.n(s),i=(a(63),a(13)),c=a(9),l=a(22),u=a(23),m=a(25),h=(a(64),function(e){function t(){return Object(i.a)(this,t),Object(l.a)(this,Object(u.a)(t).apply(this,arguments))}return Object(m.a)(t,e),Object(c.a)(t,[{key:"componentDidMount",value:function(){localStorage.getItem("x-auth-token")&&this.props.history.push("/dashboard")}},{key:"render",value:function(){return r.a.createElement("div",{className:"App"},this.props.router)}}]),t}(r.a.Component)),d=a(18),p=(a(39),a(115)),v=a(116),f=a(49),g=a.n(f).a.create({baseURL:"http://localhost:3000/api"});g.interceptors.request.use((function(e){return g.defaults.headers.common["x-auth-token"]=localStorage.getItem("x-auth-token"),e})),g.interceptors.response.use((function(e){return 400===e.status||401===e.status?localStorage.setItem("x-auth-token",""):localStorage.setItem("x-auth-token",e.headers["x-auth-token"]),e}));var E=g,b=function(){function e(){Object(i.a)(this,e)}return Object(c.a)(e,[{key:"login",value:function(e,t){return E.post("/auth/login",{username:e,password:t})}},{key:"createUser",value:function(e,t){return E.post("/users/create",{name:e,password:t})}}]),e}(),O=a(19),w=new b,C={username:"",password:""},N="username",j="password",S=function(e){function t(){var e;return Object(i.a)(this,t),(e=Object(l.a)(this,Object(u.a)(t).call(this,{},C))).state=void 0,e.props=void 0,e.error=void 0,e.handleChange=function(t){return function(a){e.setState(Object(d.a)({},t,a.target.value))}},e.state=C,e}return Object(m.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){var e=this;return r.a.createElement("div",{className:"Login"},r.a.createElement("div",{className:"Login-main"},r.a.createElement("h3",null,"Login"),r.a.createElement("form",null,r.a.createElement("div",null,r.a.createElement(p.a,{label:"Username",value:this.state.username,onChange:this.handleChange(N),margin:"normal"})),r.a.createElement("div",null,r.a.createElement(p.a,{label:"Password",value:this.state.password,type:"password",onChange:this.handleChange(j),margin:"normal"})),r.a.createElement("div",{className:"row"},r.a.createElement("div",{className:"col-2"}),r.a.createElement("div",{className:"col-4"},r.a.createElement(v.a,{variant:"contained",color:"secondary",onClick:function(){return e.signUp()}},"Sign Up")),r.a.createElement("div",{className:"col-4"},r.a.createElement(v.a,{variant:"contained",color:"primary",disabled:!this.state.username||!this.state.password,onClick:function(){return e.login()}},"Login")),r.a.createElement("div",{className:"col-2"}))),this.error))}},{key:"login",value:function(){var e=this;w.login(this.state.username,this.state.password).then((function(){Object(O.e)().push("/dashboard")})).catch((function(){e.error=r.a.createElement("div",{className:"error"},"Incorrect Credentials")}))}},{key:"signUp",value:function(){this.props.history.push("/signup")}}]),t}(r.a.Component),k=a(51);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));a(87);var y=function(e){function t(){return Object(i.a)(this,t),Object(l.a)(this,Object(u.a)(t).apply(this,arguments))}return Object(m.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){return r.a.createElement("div",null,"login works")}}]),t}(r.a.Component),A=new(function(){function e(){Object(i.a)(this,e)}return Object(c.a)(e,[{key:"createTenant",value:function(e){return E.post("/tenants/create",e)}}]),e}()),U={username:"",password:"",passwordConfirm:"",tenantName:""},R={USERNAME:"username",PASSWORD:"password",PASSWORD_CONFIRM:"passwordConfirm",TENANT_NAME:"tenantName"},M=function(e){function t(){var e;return Object(i.a)(this,t),(e=Object(l.a)(this,Object(u.a)(t).call(this,{},U))).error=void 0,e.props=void 0,e.handleChange=function(t){return function(a){e.setState(Object(d.a)({},t,a.target.value));var n=t===R.PASSWORD?R.PASSWORD_CONFIRM:R.PASSWORD;e.error=a.target.value!==e.state[n]?r.a.createElement("div",{className:"error"},"Passwords Must Match"):r.a.createElement("div",null),e.forceUpdate()}},e.state=U,e}return Object(m.a)(t,e),Object(c.a)(t,[{key:"componentDidUpdate",value:function(){}},{key:"render",value:function(){var e=this;return r.a.createElement("div",{className:"Signup"},r.a.createElement("div",{className:"Signup-main"},r.a.createElement("h3",null,"Sign Up"),r.a.createElement("form",null,r.a.createElement("div",null,r.a.createElement(p.a,{label:"E-mail",value:this.state.username,onChange:this.handleChange(R.USERNAME),margin:"normal"})),r.a.createElement("div",null,r.a.createElement(p.a,{label:"Tenant Name",value:this.state.tenantName,onChange:this.handleChange(R.TENANT_NAME),margin:"normal"})),r.a.createElement("div",null,r.a.createElement(p.a,{label:"Password",value:this.state.password,type:"password",onChange:this.handleChange(R.PASSWORD),margin:"normal"})),r.a.createElement("div",null,r.a.createElement(p.a,{label:"Confirm",value:this.state.passwordConfirm,type:"password",onChange:this.handleChange(R.PASSWORD_CONFIRM),margin:"normal"})),r.a.createElement("div",null,r.a.createElement(v.a,{variant:"contained",color:"primary",disabled:this.state.password!==this.state.passwordConfirm||!this.state.username||!this.state.password||!this.state.tenantName,onClick:function(){return e.signUp()}},"Sign Up"))),this.error))}},{key:"signUp",value:function(){var e=this,t={email:this.state.username,password:this.state.password,name:this.state.tenantName};A.createTenant(t).then((function(){e.props.history.push("/signup")})).catch((function(){}))}}]),t}(r.a.Component),P=r.a.createElement(k.a,null,r.a.createElement("div",null,r.a.createElement(O.a,{exact:!0,path:"/",component:S}),r.a.createElement(O.a,{path:"/signup",component:M}),r.a.createElement(O.a,{path:"/dashboard",component:y}))),D=r.a.createElement(h,{router:P,history:[]});o.a.render(D,document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))}},[[58,1,2]]]);
//# sourceMappingURL=main.63f37c40.chunk.js.map