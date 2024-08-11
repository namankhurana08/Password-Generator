const inputslider = document.querySelector("[data-length-slider]");
const lengthdisplay = document.querySelector("[data-length]");
const passworddisplay = document.querySelector("[data-passwordDisplay]");
const copybtn = document.querySelector("[data-copy]");
const copymsg = document.querySelector("[data-copyMsg]");
const uppercasecheck = document.querySelector("#uppercase");
const lowercasecheck = document.querySelector("#lowercase");
const numberscheck = document.querySelector("#numbers");
const symbolscheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generatebtn = document.querySelector(".generatebtn");
const allcheckbox = document.querySelectorAll("input[type=checkbox]");
const symbols="+-/*@#$%^&?><.,=[]{};";

let password="";
let passwordlength=10;
let checkcount=0;
handleslider();
setindicator("#ccc");

// set password length
function handleslider(){
    inputslider.value=passwordlength;
    lengthdisplay.innerText=passwordlength;
    const min =inputslider.min;
    const max =inputslider.max;
    inputslider.style.backgroundSize =((passwordlength-min)*100 / (max-min))+"% 100%"
}

function setindicator(color){
    indicator.style.backgroundColor=color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getrandomint(min,max){
   return  Math.floor(Math.random() * (max-min))+ min;
}

function getrandomnumber(){
    return getrandomint(0,9);
}

function getlowercase(){
   return String.fromCharCode(getrandomint(97,123));
}

function getuppercase(){
    return String.fromCharCode(getrandomint(65,91));
}

function getsymbol(){
    const random=getrandomint(0,symbols.length);
    return symbols.charAt(random);
}

function calstrength(){
    let hasupper=false;
    let haslower=false;
    let hasnumber=false;
    let hassymbol=false;
    if(uppercasecheck.checked) hasupper= true;
    if(lowercasecheck.checked) haslower= true;
    if(numberscheck.checked) hasnumber= true;
    if(symbolscheck.checked) hassymbol= true;

    if(hasupper && haslower && (hasnumber || hassymbol) && passwordlength>=8){
        setindicator("#0f0");
    }
    else if((haslower || hasupper) && (hasnumber || hassymbol) &&passwordlength>=6){
        setindicator("#ff0");
    }
    else{
        setindicator("#f00")
    }
}

async function copycontent(){
    try{
        await navigator.clipboard.writeText(passworddisplay.value);
        copymsg.innerText="copied"
    }
    catch(e){
        copymsg.innerText="Failed"
    }
    copymsg.classList.add("active");
    setTimeout(()=>{
        copymsg.classList.remove("active");
    },2000);
}

function shufflepassword(array){
    // Fisher Yaters Method
    for(let i=array.length-1;i>0;i--){
        const j=Math.floor(Math.random() * (i+1));
        const temp=array[i];
        array[i]=array[j];
        array[j]=temp;
    }
    let str="";
    array.forEach((el)=>(str+=el));
    return str;
}

function handlecheckboxchange(){
    checkcount=0;
    allcheckbox.forEach((checkbox)=>{
        if(checkbox.checked){
            checkcount++;
        }
    });

    if(password.length<checkcount){
        passwordlength=checkcount;
        handleslider();
    }
}

allcheckbox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handlecheckboxchange)
})

inputslider.addEventListener('input' ,(e)=>{
    passwordlength=e.target.value;
    handleslider();
})

copybtn.addEventListener('click',()=>{
    if(passworddisplay.value)
        copycontent();
})

generatebtn.addEventListener('click',()=>{
    if(checkcount<=0) return;
    if(passwordlength< checkcount) {
        passwordlength=checkcount;
        handleslider();
    }

    // remove old password
    password="";

    // if(uppercasecheck.checked){
    //     password+=getuppercase();
    // }
    // if(lowercasecheckcasecheck.checked){
    //     password+=getlowercase();
    // }
    // if(numberscheck.checked){
    //     password+=getrandomnumber();
    // }
    // if(symbolscheck.checked){
    //     password+=getsymbol();
    // }

    let funArr=[];
    if(uppercasecheck.checked) funArr.push(getuppercase);
    if(lowercasecheck.checked) funArr.push(getlowercase);
    if(symbolscheck.checked) funArr.push(getsymbol);
    if(numberscheck.checked) funArr.push(getrandomnumber);

    for(let i=0;i<funArr.length;i++){
        password+=funArr[i]();
    }

    // remaining
    for(let i=0;i<passwordlength-funArr.length;i++){
        let randindex= getrandomint(0,funArr.length);
        password+= funArr[randindex]();
    }

    // shuffle

    password=shufflepassword(Array.from(password));

    // display
    passworddisplay.value=password;
    // calculatestrength
    calstrength();
})


