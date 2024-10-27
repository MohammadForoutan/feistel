class FeistelCipher {
  constructor(rounds, key) {
    this.rounds = rounds;
    this.key = key;
  }

  roundFunction(input, shift) {
    return input
      .split("")
      .map((char) => {
        if (char >= "A" && char <= "Z") {
          return String.fromCharCode(
            ((char.charCodeAt(0) - 65 + shift) % 26) + 65
          );
        } else if (char >= "a" && char <= "z") {
          return String.fromCharCode(
            ((char.charCodeAt(0) - 97 + shift) % 26) + 97
          );
        } else {
          return char;
        }
      })
      .join("");
  }

  encrypt(plainText) {
    document.getElementById("debug").innerHTML = "";
    console.clear();
    let left = plainText.slice(0, Math.floor(plainText.length / 2));
    let right = plainText.slice(Math.floor(plainText.length / 2));
    console.log("Initial Left", left);
    console.log("Initial Right", right);
    console.log("--------------------------------");
    document.getElementById("debug").innerHTML +=
      "Initial Left: " + left + "<br>Initial Right: " + right + "<br>";

    for (let i = 0; i < this.rounds; i++) {
      console.log("Round", i + 1);
      const shiftedRight = this.roundFunction(right, this.key + i);
      const newLeft = right;
      const newRight = this.xorStrings(left, shiftedRight);
      left = newLeft;
      right = newRight;
      console.log("Left", left);
      console.log("Right", right);
      console.log("--------------------------------");
      document.getElementById("debug").innerHTML +=
        "Round " + (i + 1) + ": Left: " + left + " Right: " + right + "<br>";
    }

    return left + right;
  }

  decrypt(cipherText) {
    document.getElementById("debug").innerHTML = "";
    console.clear();
    let left = cipherText.slice(0, Math.floor(cipherText.length / 2));
    let right = cipherText.slice(Math.floor(cipherText.length / 2));

    console.log("Initial Left", left);
    console.log("Initial Right", right);
    console.log("--------------------------------");
    document.getElementById("debug").innerHTML +=
      "Initial Left: " + left + "<br>Initial Right: " + right + "<br>";

    for (let i = this.rounds - 1; i >= 0; i--) {
      const shiftedRight = this.roundFunction(left, this.key + i);
      const newRight = left;
      const newLeft = this.xorStrings(right, shiftedRight);
      left = newLeft;
      right = newRight;
      console.log("Left", left);
      console.log("Right", right);
      console.log("--------------------------------");
      document.getElementById("debug").innerHTML +=
        "Round " + (i + 1) + ": Left: " + left + " Right: " + right + "<br>";
    }

    return left + right;
  }

  xorStrings(left, right) {
    let result = "";
    for (let i = 0; i < left.length; i++) {
      result += String.fromCharCode(
        left.charCodeAt(i) ^ right.charCodeAt(i % right.length)
      );
    }
    return result;
  }
}

// Function to handle encryption
function encrypt() {
  const plaintext = document.getElementById("plaintext").value;
  const key = parseInt(document.getElementById("key").value);
  const rounds = parseInt(document.getElementById("rounds").value);

  const feistelCipher = new FeistelCipher(rounds, key);
  const encrypted = feistelCipher.encrypt(plaintext);

  document.getElementById("result").value = encrypted;

  delete feistelCipher;
}

// Function to handle decryption
function decrypt() {
  const ciphertext = document.getElementById("plaintext").value;
  const key = parseInt(document.getElementById("key").value);
  const rounds = parseInt(document.getElementById("rounds").value);

  const feistelCipher = new FeistelCipher(rounds, key);
  const decrypted = feistelCipher.decrypt(ciphertext);

  document.getElementById("result").value = decrypted;

  delete feistelCipher;
}
