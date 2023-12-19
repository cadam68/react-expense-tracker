const proverbs = [
  "Budgeting is like trying to fold a fitted sheet - it sounds easy until you start.",
  "Why did the penny break up with the nickel? Because it couldn't handle the constant expenses!",
  "I'm on a seafood diet. I see food, and I eat my budget instead.",
  "Money can't buy happiness, but it can buy ice cream, which is pretty much the same thing.",
  "I have a black belt in shopping. My expenses are the ultimate opponent.",
  "Why did the scarecrow become an accountant? Because he was outstanding in his field of expenses!",
  "When life gives you lemons, sell them to cover unexpected expenses.",
  "My expenses are like dust – they settle everywhere and are hard to get rid of.",
  "I'm so frugal that I could squeeze a nickel until the buffalo poops.",
  "I'm not late; I'm just on the 'extended payment plan.'",
  "Why was the math book sad? Because it had too many problems, just like my budget.",
  "My bank account is a time traveler – it always looks like I'm in the Middle Ages.",
  "I used to be a millionaire, but then I discovered online shopping.",
  "Why did the credit card go to therapy? It had too many issues!",
  "If I had a dollar for every dollar I've spent, I'd probably spend that dollar too.",
  "My expenses have more twists and turns than a roller coaster.",
  "I'm not cheap; I'm just on a very tight budget.",
  "Why did the piggy bank go to the doctor? Because it was feeling a little 'savings-sick.'",
  "I'm practicing the art of 'retail therapy' to heal my budget wounds.",
  "My wallet and I are in a long-term committed relationship – it takes all my money!",
];

const Footer = () => {
  return <footer className={"footer"}>2023 Ⓒopyright Ⓒyril | {`"${proverbs[Math.floor(Math.random() * proverbs.length)]}"`}</footer>;
};

export default Footer;
