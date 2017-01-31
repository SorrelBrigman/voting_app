  // Initialize Firebase
firebase.initializeApp({
    apiKey: "AIzaSyBCr2fNkp0pj4Cc0LvC39FN1oY3zxO9WhY",
    authDomain: "superbowlvoting.firebaseapp.com",
    databaseURL: "https://superbowlvoting.firebaseio.com",
    storageBucket: "superbowlvoting.appspot.com",
    messagingSenderId: "777645444040"
  });


var database = firebase.database();







document
  .querySelectorAll(".choice button")
  .forEach(btn => btn.addEventListener('click', onVote))


function onVote(evt) {
  //submit the vote
    //what button they click on
    const voteFor = evt.target.closest('.choice').dataset.value
    const url = 'https://superbowlvoting.firebaseio.com/votes.json'
    //go get the current counts
    fetch(url)
    .then(stream => stream.json())
    .then(data => {
      const newCount = data && data[voteFor] ? data[voteFor] += 1 : 1
       //patch the new count
       return fetch( url,
        {
          method : 'PATCH',
          body: JSON.stringify({ [voteFor] : newCount})
        })
      .then(()=>{
        document.querySelectorAll('h3').forEach(h => {
          const total = Object.values(data).reduce((acc, val)=>{
            return acc + val
          })
          const current = data[h.closest('.choice').dataset.value]
          h.innerText = Math.round( current / total * 100) + "%"
        })
      })


      console.log(data)
      //show the current vote totals
    })

    .catch((e)=>(console.log(e)))

    //hide the buttons
  document.querySelectorAll("button").forEach(btn=> btn.remove())


}
