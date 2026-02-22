// Clock
function showClock() {
  let clockElement = document.getElementById("clock");
  if (!clockElement) return;   // 🔥 prevents crash

  let now = new Date();

  let hours = now.getHours();
  let minutes = now.getMinutes();
  let seconds = now.getSeconds();

  if (hours < 10) hours = "0" + hours;
  if (minutes < 10) minutes = "0" + minutes;
  if (seconds < 10) seconds = "0" + seconds;

  clockElement.innerText = hours + ":" + minutes + ":" + seconds;
}


// run every second
setInterval(showClock, 1000);

// run immediately on page load
showClock();


// ADMIN LOGIN
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "1234";

function adminLogin() {
  let user = document.getElementById("adminUser").value;
  let pass = document.getElementById("adminPass").value;

  if (user === ADMIN_USERNAME && pass === ADMIN_PASSWORD) {
    localStorage.setItem("adminLoggedIn", "true");
    alert("Admin logged in successfully");

    document.getElementById("loginBox").style.display = "none";
    document.getElementById("adminPanel").style.display = "block";
  } else {
    alert("Invalid Username or Password");
  }
}

// Check admin credentials
if (document.getElementById("adminPanel")) {
  if (localStorage.getItem("adminLoggedIn") === "true") {
    document.getElementById("loginBox").style.display = "none";
    document.getElementById("adminPanel").style.display = "block";
  } else {
    document.getElementById("adminPanel").style.display = "none";
  }
}

// Pg direction
function openVoterPage() {
  window.location.href = "register-voter.html";
}

function openCandidatePage() {
  window.location.href = "register-candidate.html";
}

// Voting control
function startVoting() {
  localStorage.setItem("votingStatus", "true");
  alert("Voting Started");

  // Open voting page in new tab
  window.open("vote.html", "_blank");
}

function stopVoting() {
  localStorage.setItem("votingStatus", "false");
  alert("Voting Stopped");
  window.location.href = "results.html";
}

// Logout ( for admin)
function logout() {
  localStorage.removeItem("adminLoggedIn");
  alert("Logged out");
  window.location.href = "admin.html";
}

// Reg of voters
function generateVoterId() {
  let usedIds = JSON.parse(localStorage.getItem("usedVoterIds")) || [];
  let id;

  do {
    id = Math.floor(10 + Math.random() * 90); // 10–99
  } while (usedIds.includes(id));

  usedIds.push(id);
  localStorage.setItem("usedVoterIds", JSON.stringify(usedIds));

  return id;
}

function registerVoter() {
  let name = document.getElementById("voterName").value;
  let age = document.getElementById("age").value;
  let gender = document.querySelector('input[name="gender"]:checked');

  if (!name || !age || !gender) {
    alert("Please fill all details");
    return;
  }

  if (age < 18) {
    alert("Age must be 18 or above");
    return;
  }

  let voterId = generateVoterId();

  let voters = JSON.parse(localStorage.getItem("voters")) || [];

  voters.push({
    voterId: voterId,
    name: name,
    age: age,
    gender: gender.value,
    hasVoted: false
  });
// show voterid to user
  localStorage.setItem("voters", JSON.stringify(voters));

  document.getElementById("generatedId").innerHTML =
    "✅ Your Voter Registration Successful!<br>Here's Your Voter ID: <b>" + voterId + "</b>";

  document.getElementById("voterForm").reset();
}


// REGISTER CANDIDATE
function registerCandidate() {
  let title = document.getElementById("title").value;
  let name = document.getElementById("candidateName").value;
  let gender = document.getElementById("gender").value;
  let dob = document.getElementById("DOB").value;
  let age = parseInt(document.getElementById("age").value);
  let party = document.getElementById("partyName").value;

  // Validation
  if (!title || !name || !gender || !dob || !age || !party) {
    alert("Please fill all details");
    return;
  }

  if (age < 18) {
    alert("Candidate must be at least 18 years old");
    return;
  }

  // Get existing candidates
  let candidates = JSON.parse(localStorage.getItem("candidates")) || [];

  // Store candidate
  candidates.push({
    id: Date.now(),
    title: title,
    name: name,
    gender: gender,
    dob: dob,
    age: age,
    party: party,
    votes: 0
  });

  localStorage.setItem("candidates", JSON.stringify(candidates));

  alert("Candidate Registered Successfully");

  // Reset form
  document.getElementById("candidateForm").reset();
}


// Cast votes
function validateVoter() {
  let voterId = document.getElementById("voterIdInput").value;
  let voters = JSON.parse(localStorage.getItem("voters")) || [];

  let voter = voters.find(v => v.voterId == voterId);

  if (!voter) {
    alert("Invalid Voter ID");
    document.getElementById("candidateList").innerHTML = "";
    return;
  }
  if (voter.hasVoted) {
    alert("You have already voted");
    document.getElementById("candidateList").innerHTML = "";
    return;
  }

  if (localStorage.getItem("votingStatus") !== "true") {
    alert("Voting is closed");
    return;
  }

  loadCandidates(); // ✅ SHOW candidates now
}
//loads candidates
function loadCandidates() {
  let candidates = JSON.parse(localStorage.getItem("candidates")) || [];
  let div = document.getElementById("candidateList");
  div.innerHTML = "";

  if (candidates.length === 0) {
    div.innerHTML = "<p>No candidates available</p>";
    return;
  }

  candidates.forEach(c => {
    div.innerHTML += `
      <div>
        <input type="radio" name="candidate" value="${c.id}">
        ${c.name} (${c.party})
      </div>
    `;
  });
}
function castVote() {
  let voterId = document.getElementById("voterIdInput").value;
  let selected = document.querySelector('input[name="candidate"]:checked');

  if (!selected) {
    alert("Please select a candidate");
    return;
  }

  let voters = JSON.parse(localStorage.getItem("voters")) || [];
  let voter = voters.find(v => v.voterId == voterId);

  let candidates = JSON.parse(localStorage.getItem("candidates")) || [];
  let candidate = candidates.find(c => c.id == selected.value);

  candidate.votes += 1;
  voter.hasVoted = true;

  localStorage.setItem("candidates", JSON.stringify(candidates));
  localStorage.setItem("voters", JSON.stringify(voters));

  alert("Vote cast successfully!");
  window.location.reload();
}


// Result showing
function loadResults() {
  let resultDiv = document.getElementById("results");
  if (!resultDiv) return;

  let candidates = JSON.parse(localStorage.getItem("candidates")) || [];

  candidates.forEach((c) => {
    resultDiv.innerHTML += `<p>${c.name} (${c.party}) → Votes: ${c.votes}</p>`;
  });
}

loadResults();

// To reset the stored information
function resetSystem() {
  if (confirm("Are you sure you want to reset the election?")) {
    localStorage.removeItem("voters");
    localStorage.removeItem("candidates");
    localStorage.removeItem("voterIds");
    localStorage.removeItem("votingStatus");

    alert("System reset successfully");
    window.location.reload();
  }
}


// AUTO CALCULATE AGE FROM DOB
document.getElementById("DOB").addEventListener("change", function () {
  let dob = new Date(this.value);
  let today = new Date();

  let age = today.getFullYear() - dob.getFullYear();
  let monthDiff = today.getMonth() - dob.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < dob.getDate())
  ) {
    age--;
  }

  document.getElementById("age").value = age;
});
