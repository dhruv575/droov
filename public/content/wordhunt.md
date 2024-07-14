## The Background: Pokemon Planet 

I'm at a pretty competitive person. I enjoy winning. Perhaps I take the pursuit of victory too far sometimes. 

In 11th grade I used to be obsessed with this game called Pokémon Planet (recently renamed Poke Nexus). This MMORPG allowed players to navigate through several regions, building their teams, trading items and Pokémon, and chatting with other trainers through the general channel. One day, a random user decided to start hosting daily Pokeno Unscrambling competitions with pretty cool projects. While I found myself being quite good at these, I'd really stopped keeping up with the new Pokémon after the release of X & Y, and thus was missing almost half the PokeDex. **So I decided to cheat**. 

![Keldeo my Goat](https://i.ibb.co/bNDrNqw/KELDEO.png "Keldeo")

After a bit of experimentation, I coded a simple engine that could take any phrase and return the unscrambled Pokémon. It was quite a fun little concept and while I did win almost every Pokémon Unscramble contest I competed in since then (don't worry I would never accept the prizes), this wasn't exactly something I could show off to my friends

## The Problem: Word Hunt

Game Pigeon's Word Hunt, on the other hand, was a game I had *absolutely no* natural aptitude for. I would regularly get hammered by my friends. I have no idea why I was so bad at this game in particular. I wanted to fix that too though, so I decided to cheat again.

This attempt at cheating, however, was quite a bit harder than the previous ones. Before this, my coding experience was extremely limited to the basics needed to operate robots. I was by no means an excellent coder. I'd never even done AP Computer Science A. I was, however, signed up to self-study and take that AP test in 5 months, so I decided now might be a good time to get started learning!

It took me a long time. I screwed up a lot. I had to invent recursion. Eventually I got it though! So let's talk about the infrastructure.

## The Solution: Part 1, Naive Approach

![Word Hunt Example Grid](https://i.ibb.co/Pj5Sx0B/wh.jpg "Word Hunt Example Grid")

Consider the 4 x 4 grid. Each letter has at least 3 and at most 8 neighbors. Let's just solve for a lower bound right now. Assuming that each letter has 3 neighbors, we would have *16 * 3* possibilities for combinations of words. This computes to roughly to **230 million** possible words. Remember that this is quite a significant underestimate; the real number is likely around *3^8* or *6561* times greater than this. Now consider the dictionary of words used by Word Hunt. We're thinking about another **300000** words that you would have to cross reference each of those **230 million** possibilities against. To summarize, a naive approach is unreasonable. We would already waste around 6 seconds typing in the 16 letters, and this would likely take anywhere between 30 and 40 seconds to compute. Though we could still win, it would make it a lot harder.

I decided to run the code real quick. In total, you create 

## The Solution: Part 2, The Algorithm

I knew that right away, I needed to significantly lower the number of comparisons from both sides. This meant I needed to be searching through less possibilties, and comparing with less words.

My initial thought was restriction. By looking for words greater than 4 letters, we could significantly reduce the number of words to cross reference. Another idea that came to mind was only using words that included letters form our grid (i.e. if there was no q in the grid, words like quiz would be immediately eliminated). However, this would do nothing to lower our **230 million** possibilities.

Therefore, I decided to think about it at a smaller level. If I was manually doing it, how would I solve for all of the words that originated from the letter at the top left corner, **O** in our example above. Firstly I would consider only the words that started with O (only, other, over, once, open, offer, order, often, other, owner). Next, I would go to all of the neighboring letters to O and think about them in the same way, in this case **OA**, **OI**, and **OH**. Now, I have an even smaller corpus to look through for each possibility: (oath, oasis, oaken, oars), (oint, ointment, oiling, oiler), (ohio). Take this another step further and the number of words to cross reference will reduce further, until you reach the point where you have 0 possible words left, at which point you terminate. 

By implementing this algorithm, you are able to significanly reduce the amount of time your code takes. 

## The Solution: Part 3, Presentation

Believe it or not, it only took 84 lines of code to implement the algorithm above. However, at this point, I was just printing all the words ordered by size. This did not make for a particularly efficient experience for me while using it, so I decided that once the words were found, I would organize them by the same roots (i.e. same first 3 letters) and then order the roots by points, so that users could find a root, exhaust it, then move on the next most profitable one. Here are the results from running the Word Hunt Solver on the board above.

```
[aith]
[erns]
[erst]
[eten]
[hait]
[hats]
[hete]
[hoit]
[nein]
[nene]
[oath]
[ohia]
[phat]
[phit]
[pret]
[thio]
[tiao]
[enent]
[enhat]
[hithe]
[paho, pahi]
[path, pats]
[reins]
[rins, rine]
[snerp]
[apts, apter]
[insp, instr]
[iter, iters]
[nete, neter]
[that, thats]
[terp, tern, terns]
[taps, tapnet]
[then, thenne]
[rete, retia, rethe]
[prin, prie, print, prine]
[hent, henen, henter]
[inne, innet, inners]
[inti, inter, inters]
[spat, spath, spait, spahi]
[entia, enter, enters]
[tens, tenne, tenners]
[pterin, pterins]
[spret, sprent, sprint]
[rent, renn, rente, renne, renet, rennet]
[stap, staio, staph, staith, staithe]
[haps, hapten, haptene, haptens]
```

## The Aftermath: AP CS A

Around 3 months or so after finishing this code, I had to take the AP Computer Science A exam. In the intermediate time, I hardly studies the Barron's textbook at all. Instead, I put my time into writing pretty code that solved more interesting problems for me. I'd soon coded cheats for Wordle, the classic Scrabble, and several other games and variants (my favorite perhaps being for Kilordle, a crazy Wordle variant that I believe is still unsolved).

I truly believe that this practical application allowed me to get a perfect score on AP CS A, becoming one of only 348 students in the world to score every possible point on the test. Reading a book will only get you so far; by building things myself and experiencing hundreds and hundreds of errors, I realized what was wrong, what was right, and what was possible.