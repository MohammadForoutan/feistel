function generateDebugTable(debugData) {
  const debugElement = document.getElementById("debug");
  debugElement.innerHTML = `
    <table border="1">
      <tr>
        <th>Round</th>
        <th>Left</th>
        <th>Right</th>
      </tr>
      ${debugData
        .map(
          (item) => `
        <tr>
          <td>${item.round}</td>
          <td>${item.left}</td>
          <td>${item.right}</td>
        </tr>
      `
        )
        .join("")}
    </table>
  `;
}

class FeistelCipher {
  constructor(rounds, key) {
    this.rounds = rounds;
    this.key = key;
  }

  roundFunction(input, shift) {
    // Ensure the shift is positive
    const positiveShift = shift < 0 ? -shift : shift; // Convert negative to positive
    // Normalize the shift value to ensure it is between 0 and 25
    const normalizedShift = positiveShift % 26;

    return (
      input
        .split("") // Split the input string into an array of characters
        .map((char) => {
          // Check if the character is an uppercase letter (A-Z)
          if (char >= "A" && char <= "Z") {
            return String.fromCharCode(
              // Normalize the character's ASCII value, apply the shift, and wrap around using modulo
              ((char.charCodeAt(0) - 65 + normalizedShift) % 26) + 65
            );
          }
          // Check if the character is a lowercase letter (a-z)
          else if (char >= "a" && char <= "z") {
            return String.fromCharCode(
              // Normalize the character's ASCII value, apply the shift, and wrap around using modulo
              ((char.charCodeAt(0) - 97 + normalizedShift) % 26) + 97
            );
          }
          // If the character is neither uppercase nor lowercase
          else {
            // Return the character unchanged (e.g., numbers, punctuation, spaces)
            return char;
          }
        })
        // Join the transformed array of characters back into a single string
        .join("")
    );
  }
  encrypt(plainText) {
    console.clear();
    let left = plainText.slice(0, Math.floor(plainText.length / 2));
    let right = plainText.slice(Math.floor(plainText.length / 2));
    console.log("Initial Left", left);
    console.log("Initial Right", right);
    console.log("--------------------------------");

    const debugData = [{ round: "Initial", left, right }];

    for (let i = 0; i < this.rounds; i++) {
      console.log("Round", i + 1);
      const shiftedRight = this.roundFunction(right, this.key + i); // generate sub keys
      const newLeft = right;
      const newRight = this.xorStrings(left, shiftedRight);
      left = newLeft;
      right = newRight;
      console.log("Left", left);
      console.log("Right", right);
      console.log("--------------------------------");

      debugData.push({ round: i + 1, left, right });
    }

    generateDebugTable(debugData);

    return left + right;
  }

  decrypt(cipherText) {
    console.clear();
    let left = cipherText.slice(0, Math.floor(cipherText.length / 2));
    let right = cipherText.slice(Math.floor(cipherText.length / 2));
    console.log("Initial Left", left);
    console.log("Initial Right", right);
    console.log("--------------------------------");

    const debugData = [{ round: "Initial", left, right }];

    for (let i = this.rounds - 1; i >= 0; i--) {
      console.log("Round", this.rounds - i);
      const shiftedRight = this.roundFunction(left, this.key + i);
      const newRight = left;
      const newLeft = this.xorStrings(right, shiftedRight);
      left = newLeft;
      right = newRight;
      console.log("Left", left);
      console.log("Right", right);
      console.log("--------------------------------");

      debugData.push({ round: this.rounds - i, left, right });
    }

    generateDebugTable(debugData);

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

  console.log("encrypted", encrypted);

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

  console.log("decrypted", decrypted);

  delete feistelCipher;
}
