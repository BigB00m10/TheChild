/*
    Garden activities when alone with a slave
    by Spartianian

    THIS IS INCOMPLETE AND JUST THE BEGINNING OF THIS
    
    TO DO:

      Need ability to lock this stuff out for those not into it
        pee toggle
        poop toggle

      Better writing
      More events
      More variants
      Branching
      Special version for toddlers (age < 3)
      Special version for infants
      Keep track of slave bodily functions
      

*/
let peeNaked = () =>
  window.Interactions.test.options["pee"]
  .next as NpcInteractionOptions;

let poopNaked = () =>
  window.Interactions.test.options["poop"].next.pooping
  .next as NpcInteractionOptions;

window.Interactions["gardenHelper"] = {
  defaultStopOption: "✋ Nevermind",  
  contents: `You notice $npc.name in the garden, the $npc.gender<<if $npc.haveClothes>>'s clothing gently moving in the breeze.<<else>><<if $npc.aroused>> is nude and $npc.possessive <<if $npc.hasPenis>>$npc.genitals.male erect.<<elseif $npc.hasPussy>>hands occasionally touching $npc.possessive $npc.genitals.female.<</if>><<else>> is nude.<</if>><</if>>`,
  options: {
        /*
            Watering the garden
        */
        pee: {
        optionText: "Do you need to pee?",
        contents: `
          You look at your garden and then at $npc.name.
          <<playerSay 'Do you need to pee?'>>
          <<if $npc.uniqueness.naughty>>\
            <<if $npc.love gt 35>>
              <<npcSay '...yes.'>>
            <<elseif $npc.love gt 60>>\
              <<npcSay 'Yes, <<npcAddressPlayer>>'>>
            <<else>>\
              <<npcSay '...yeah.'>>
            <</if>>\
          <<elseif $npc.uniqueness.shy>>\
            $npc.name looks confused.

            <<playerSay '$npc.name, do you need to pee?'>>

            The $npc.gender's cheeks flush.
            <<npcSay '...yes'>>
          
            $npc.name begins to walk towards the house when you stop $npc.pronoun.

            You point to a spot in the garden. <<playerSay 'Here.'>>

            Reluctantly, $npc.name walks back to the indicated place.
          <<else>>\
            <<npcSay 'Yes.'>>
          <</if>>\
          <<if $npc.haveClothes>><<set _naked = false>><<else>><<set _naked = true>><</if>>
        `,
        /*
            The undressing scene needs more variation, especially tracking obedience, fear and love
        */
        next: {
          undress: {
            canBeShown: () => !Temporary().naked,
            optionText: "Undress the $npc.gender",
            next: () => peeNaked(),
            contents: `
              You kneel in front of the $npc.gender and grasp $npc.possessive clothing.
              <<if $npc.uniqueness.shy>>\
                <<npcSay 'No...'>>

                You sharply spank $npc.name and begin undressing the $npc.age year old $npc.gender and shortly $npc.name is in $npc.possessive underwear.

                <<if $npc.hasPussy>>\
                  You grasp $npc.name's panties and look up and find the $npc.gender is looking away.

                  <<playerSay 'Look at me!'>>

                  Reluctantly the child looks down into your eyes as you slowly pull $npc.possessive panties down exposing the shy child's pussy.
                <</if>>\
                <<if $npc.hasPenis>>\
                  You grasp $npc.name's briefs and look up and find the $npc.gender is looking away.

                  <<playerSay 'Look at me!'>>
            
                  Reluctantly the child looks down into your eyes as you slowly pull $npc.possessive briefs down exposing the shy child's cock.
                <</if>>\ 
              <<else>>\
                <<if $npc.hasPussy>>\
                  You grasp $npc.name's panties and glance up to see the $npc.gender watching as you slide $npc.possessive panties down exposing $npc.possessive pussy.
                <</if>>\
                <<if $npc.hasPenis>>\
                  You grasp $npc.name's briefs glance up to see the $npc.gender watching as you slide $npc.possessive briefs down exposing $npc.possessive dick.
                <</if>>\ 
              <</if>>\

              Soon the $npc.age year old is naked in the garden.
              <<set _naked = true>>
            `,
          },
          /*
              The actual watering of the garden.
          */
          peeing: {
            canBeShown: () => Temporary().naked,
            optionText: "Have $npc.name begin",
            contents: `
              <<playerSay 'You are going to help my water my garden, $npc.name.'>>
              <<set _pee = true>>\
              <<if $npc.uniqueness.naughty>>\
                <<if $npc.hasPenis>>\
                  You stand behind $npc.name, reaching around $npc.possessive body and hold the $npc.gender's $npc.genitals.male.
                  <<if $npc.aroused>>\
                    You smile as you feel $npc.possessive penis hard in your hand and the $npc.gender moans.
                  <</if>>
                <<elseif $npc.hasPussy>>\ 
                  <<if $player.hasPussy>>\
                    You disrobe and squat and motion to have the $npc.gender squat in front of you.
                    <<if $npc.aroused>>\
                      The $npc.age year old $npc.gender looks between your legs as you gaze at $npc.possessive glistening $npc.genitals.female.   You spread your labia apart giving $npc.pronoun an excellent view.
                    <</if>>\
                    $npc.name begins to pee and moans as you reach out and rub $npc.possessive clitoris.
                  <<elseif $player.hasPenis>>\
                    You disrobe and have the $npc.gender squat in front of you.  Your penis brushing the $npc.age year old $npc.gender's lips.
                    $npc.name begins to pee as you insert the tip of your penis into $npc.possessive mouth.
                  <</if>>\
                <</if>>\
              <<elseif $npc.uniqueness.shy>>\\
                <<if $npc.hasPenis>>\
                  You stand behind $npc.name, reaching around $npc.possessive body and hold the $npc.gender's $npc.genitals.male.
                  <<if $npc.aroused>>\
                    You smile as you feel $npc.possessive penis hard in your hand as the $npc.gender squirms uncomfortably.
                  <</if>>\
                <<elseif $npc.hasPussy>>\ 
                  You kneel in front of the $npc.age year old $npc.gender and run a finger up and down $npc.possessive slit before positioning $npc.name into a squatting position.
                  <<playerSay 'Start now, $npc.name.'>>
                  <<npcSay 'I&apos;m sorry.  I can&apos;t while you&apos;re watching.'>>
                  <<playerSay 'Start pissing!'>>
                  $npc.name begins to cry but soon you see $npc.pronoun begin to urinate.
                  <<playerSay 'Good girl.'>>
                  You look between $npc.pronoun legs watching the urine spray and then watch the tears flow down her face.   Leaning forward, you gently kiss $npc.pronoun and then feel $npc.pronoun start as your hand slides up and down $npc.possessive $npc.genitals.female as $npc.genPronoun continues urinating.
                <</if>>                  
              <<else>>\
                <<if $npc.hasPenis>>\
                  TO DO: Other boy.
                  <<if $npc.aroused>>\
                    You smile as you feel $npc.possessive penis hard in your hand.
                  <</if>>
                <<elseif $npc.hasPussy>>\ 
                  Other girl.
                  <<if $npc.aroused>>\
                  TO DO: Other girl is aroused.
                  <</if>>\
                <</if>>
              <</if>>\
            `,
              /*
                  The optional followup
              */
              next: {
              cleanupboy: {
                npcRequirements: ["hasPenis"],
                optionText: "Cleanup $npc.name",
                contents: `
                <<if $npc.uniqueness.naughty>>\
                  TO DO: Naughty boy
                <<elseif $npc.uniqueness.shy>>\\
                  TO DO: Shy boy
                <<else>>\\
                  TO DO: Other boy
                <</if>>\\
              `,
              },
              cleanupgirl: {
                npcRequirements: ["hasPussy"],
                optionText: "Cleanup $npc.name",
                contents: `
                  <<if $npc.uniqueness.naughty>>\
                    TO DO: Naughty girl
                  <<elseif $npc.uniqueness.shy>>\\
                    TO DO: Shy girl
                  <<else>>\\
                    TO DO: Other girl
                  <</if>>\\
                `,
              },
            },
          },
      },
    },
    /*
        Fertilizing the garden

        TO DO:
          This needs restructured a little
          need a sequence for undressing
    */
    poop: {
        optionText: "Do you need to poop?",
        contents: `<<npcSay '...yes'>>
          <<set _poop = true>>\
          You have the child squat in the garden and position yourself behind them.
          <<if $npc.hasPenis>>\
             As $npc.name begins pooping, you stroke $npc.possessive $npc.genitals.male.
          <<else>>\
             As $npc.name begins pooping, you rub $npc.possessive $npc.genitals.female.
          <</if>>\
          <<if $npc.uniqueness.naughty>>\
             "I love you, <<npcAddressPlayer>>."
          <<elseif $npc.uniqueness.shy>>\
             "Please don't look, <<npcAddressPlayer>>!"
          <</if>>\
          <<if $player.hasPenis>>\
             You stroke your penis as $npc.name defecates.
          <<else>>\
             You rub your cunt as $npc.name defecates.
          <</if>>\
        `,
        next: {
            eat: {
                canBeShown: () => Temporary().poop,
                optionText: "Eat some of $npc.name's poop.",
                contents: `
                    You reach underneath $npc.name's body grasping $npc.possessive half-emerged turd.
                    <<if $npc.uniqueness.naughty>>\
                        "You're grabbing my poop!"
                    <<elseif $npc.uniqueness.shy>>\
                         "What are you doing?!"
                    <</if>>\
                    You hold it front of your mouth and lick $npc.possessive feces and then place it inside your mouth.
                    <<if $npc.uniqueness.naughty>>\
                       "You're eating my poop <<npcAddressPlayer>>!  Feed some to me!"
                       <<set _wants_some = true>>\
                    <<elseif $npc.uniqueness.shy>>\
                       "What's that noise?!"
                       <<set _horrified = true>>\
                    <</if>>
                `,
                next: {
                    feed: {
                        canBeShown: () => Temporary().wants_some,
                        optionText: "Feed $npc.pronoun.",
                        contents: `
                            You have $npc.name twist around and kiss $npc.pronoun, pushing the feces into the child's mouth.
                            <<if $npc.hasPenis>>\
                                Your filthy fingers stroke the child's $npc.genitals.male.
                            <<else>>\
                                Your filthy fingers rub the child's $npc.genitals.female.
                            <</if>>\
                            <<if $npc.lust gte 60>>\
                                <<if $player.hasPenis>>\
                                    $npc.name reaches between your legs, stroking your penis as you both taste $npc.possessive feces.
                                <<else>>\
                                    $npc.name reaches between your legs, rubbing your clit as you both taste $npc.possessive feces.
                                <</if>>\
                                $npc.name breaks the kiss and swallows $npc.possessive feces, smiling at you.
                                <<if !$player.hasPenis>>\
                                    $npc.name reaches behind $npc.pronoun body for moment.  When $npc.genPronoun hand is back in view you see $npc.pronoun is holding a turd.
                                    The child moves it between your legs rubbing it over your clitoris.

                                    "I want to put this inside my 'mommy'."

                                    You lay on your back holding your legs up and feel the filthy object move up and down your slit before being stuffed into your own vagina.
                                    $npc.name licks your clit while pushing the filth deep inside you.
                                    "I love you so much."
                                <</if>>\
                            <</if>>\                            
                        `,
                    },
                    horrified: {
                        canBeShown: () => Temporary().horrified,
                        optionText: "Terrify $npc.possessive.",
                        contents: `
                            Still chewing on $npc.name's feces, you reach in between $npc.possessive legs.
                            <<if $npc.hasPenis>>
                                Your filth coated hand wraps around the boy's penis.
                            <<else>>
                                You begin stuffing the girl's vagina with $npc.possessive own feces.
                            <</if>>
                        `,
                        next: {
                            horror: {
                                playerRequirements: ["hasPussy"],
                                optionText: "Continue...",
                                contents: `
                                    You push $npc.pronoun to the ground onto $npc.possessive on excrement with a turd hanging out of $npc.possessive own anus.
                                    <<if $npc.hasPenis>>\
                                      You lower yourself on $npc.name's $npc.genitals.male, guiding it inside your vagina.
                                      You start fucking $npc.pronoun and bend down to kiss $npc.pronoun.
                                      The child squirms away, horrified.   
                                      You stop with $npc.name's $npc.genitals.male deep inside and begin urinating.
                                    <<else>>
                                      You squat over $npc.name's stomach, bent over to force $npc.possessive legs apart and stuff the girl's cunt full of feces.
                                      You push and urinate and defecate on $npc.pronoun stomach and reach back to add it to the stuffing.
                                    <</if>>
                                `,
                            },
                        },
                    },
                },
            },
        },
    },
  },
  
};