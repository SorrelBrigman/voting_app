  // Initialize Firebase
firebase.initializeApp({
    apiKey: "AIzaSyBCr2fNkp0pj4Cc0LvC39FN1oY3zxO9WhY",
    authDomain: "superbowlvoting.firebaseapp.com",
    databaseURL: "https://superbowlvoting.firebaseio.com",
    storageBucket: "superbowlvoting.appspot.com",
    messagingSenderId: "777645444040"
  });





const votesRef = firebase.database().ref('votes')
const messageRef = firebase.database().ref('messages')

votesRef.on('value', onUpdate)
messageRef.limitToLast(2).on('child_added', onNewMessage)

function onNewMessage(snap) {
  const data = snap.val()
  document.querySelector(".messages").innerHTML += `<div><strong>${data.name}</strong>: ${data.message}</div>`
}



function onVote(evt) {
  //submit the vote
    //what button they click on
    const voteFor = evt.target.closest('.choice').dataset.value
    // const url = 'https://superbowlvoting.firebaseio.com/votes.json'
    //go get the current counts
    // fetch(url)
    //.then(stream => stream.json())
    votesRef.once('value')
    .then(snap => snap.val())
    .then(data => {
      const newCount = data && data[voteFor] ? data[voteFor] += 1 : 1
       //patch the new count

       return votesRef.update({[voteFor] : newCount })



      console.log(data)
      //show the current vote totals
    })

    .catch((e)=>(console.log(e)))

    //hide the buttons
  document.querySelectorAll("button").forEach(btn=> btn.remove())
  document.querySelectorAll(".hidden").forEach(item => item.classList.remove('hidden'))


}//end of onVote()


function onMessage (snap) {
  const data = snap.val()
  let messageField = ""
  data.forEach((val) => {
    messageField += "name: "
    messageField += val.name;
    messageField += "message: "
    messageField += val.message

  })

  document.querySelector(".messages").innerText = messageField
}



function onUpdate (snap) {
  const data = snap.val()

  document.querySelectorAll('h3').forEach(h => {
    const total = Object.values(data).reduce((acc, val)=> {
      return acc + val
      })
    const current = data[h.closest('.choice').dataset.value]
    h.innerText = Math.round( current / total * 100) + "%"
  })
}


const sendMessage = (evt) => {
  evt.preventDefault()
  let name = document.querySelector('.name').value.trim()
  let message = document.querySelector('.message').value.trim()

  let mess = {
    "name" : name,
    "message" : message
  }

  return messageRef.push(mess)
    .then((e)=> {
      console.log(e)
      document.querySelector('.message').value = ''
    })
    .then()
}






document
  .querySelectorAll(".choice button")
  .forEach(btn => btn.addEventListener('click', onVote))

document
  .querySelector("form")
  .addEventListener("submit", sendMessage)
