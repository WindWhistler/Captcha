async function getCaptcha() {
  console.log("Hi anon!");
  do {
    t=1+getRandomInt(16000);
    currentCaptcha = await getNewCaptcha(t);
  } while (getPngDimensions(currentCaptcha.fg).width < 275)
  document.getElementById("input").value = "";

  console.log(getPngDimensions(currentCaptcha.fg).width);
  console.log(getPngDimensions(currentCaptcha.bg).width);

  //Set captcha
  let fg = document.getElementById("fg");
  let bg = document.getElementById("bg");
  let outer = document.getElementById("outer");
  let form = document.getElementById("form");
  bg.setAttribute("style",`
    overflow:auto; 
    background-position: 0px top; 
    width: ${getPngDimensions(currentCaptcha.bg).width}px; 
    height: 100%; 
    position: absolute;
    background-repeat: no-repeat;
    background-image: url("data:image/png;base64,` + currentCaptcha.bg + `");`
  );
  fg.setAttribute("style",`
    background-position: 0px top; 
    width: ${getPngDimensions(currentCaptcha.fg).width}px; 
    height: 81px; 
    position: fixed;
    background-repeat: no-repeat; 
    background-image: url("data:image/png;base64,` + currentCaptcha.fg + `");`
  );
  outer.setAttribute("style",`
    width: ${Math.max(275,getPngDimensions(currentCaptcha.fg).width)}px;  
    height: 96px; 
    position: relative; 
    display: flex; 
    overflow:auto;`
  );
  form.setAttribute("style",`
    position: relative;
    width: ${Math.max(275,getPngDimensions(currentCaptcha.fg).width)}px;
    background: #eee;
    border: 1px solid #777; 
    margin: 2px 0 2px 0;
    vertical-align: middle;"`
  );
  mode = currentCaptcha.mode;
  answer = currentCaptcha.answer;
  
  let post = document.getElementById("post");
  post.disabled = false;
  rep = document.getElementById("reply");
  rep.hidden = true;

  let get = document.getElementById("get");
  get.disabled = true;
  setTimeout(() => {
    let get = document.getElementById("get");
    get.disabled = false;
  }, 10000)
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

async function getNewCaptcha(index) {
  var res = await fetch(this.location.origin + "/captcha/" + index);
  return await res.json();
}

async function checkCaptcha() {
  let post = document.getElementById("post");
  post.disabled = true;
  
  let fg = document.getElementById("fg");
  let bg = document.getElementById("bg");
  bg.setAttribute("style",`
    overflow:auto; 
    background-position: 0px top; 
    width: 100%; 
    height: 100%; 
    position: absolute;
    background-repeat: no-repeat;
    background-image: ""`
  );
  fg.setAttribute("style",`
    background-position: 0px top; 
    width: 100%; 
    height: 81px; 
    position: fixed;
    background-repeat: no-repeat; 
    background-image: ""`
  );

  testAnswer = document.getElementById("input").value;
  document.getElementById("input").value = "";
  if (mode == 'dev') {
    rep = document.getElementById("reply");
    rep.hidden = false;
    res = await fetch(this.location.origin = "/captcha/" + t, {
      method: "post",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        bg:currentCaptcha.bg,
        fg:currentCaptcha.fg,
        answer:testAnswer
      })
    });
  }
  else {
    if (testAnswer == answer) {
      document.getElementById("result").setAttribute("style", `
      font-size: 72px; 
      font-weight: bold;
      text-align: center;
      margin-top: 0px;
      position: absolute;
      left: 0; 
      right: 0; 
      margin-inline: auto; 
      width: 100%;
      height: 100%;
      color: #18af0a;
      background-color: #79f36e;
      font-family: myFont;
      letter-spacing: 2px;
      z-index: 99;`);
      smtxt = document.getElementById("smtxt")
      smtxt.textContent = "Success!"
    }
    else {
      document.getElementById("result").setAttribute("style", `
      font-size: 72px; 
      font-weight: bold;
      text-align: center;
      margin-top: 0px;
      position: absolute;
      left: 0; 
      right: 0; 
      margin-inline: auto; 
      width: 100%;
      height: 100%;
      color: #af0a0aff;
      background-color: #f36e6eff;
      font-family: myFont;
      letter-spacing: 2px;
      z-index: 99;`);
      smtxt = document.getElementById("smtxt")
      smtxt.textContent = "Failure!"
    }
    document.getElementById("result").setAttribute("class", "fade-element show");
    setTimeout(() => {
      document.getElementById("result").setAttribute("class", "fade-element");
    }, 7000);
  }
}


function getPngDimensions(base64) {
  const header = atob(base64.slice(0, 50)).slice(16,24)
  const uint8 = Uint8Array.from(header, c => c.charCodeAt(0))
  const dataView = new DataView(uint8.buffer)

  return {
    width: dataView.getInt32(0),
    height: dataView.getInt32(4)
  }
}