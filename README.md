# Scalar implicature paradigms

## Methods

[Link to the online card game](https://web.stanford.edu/~masoudj/online_experiment/connective_game.html)

## Goal

**Investigate various dependent measures that have been used to measure scalar implicatures to try to understand what exactly is being measured, by specifying explicit linking functions between RSA and the dependent measures.**

Write up the results for the Frontiers special issue:

Hosting Field: Frontiers in Psychology   Journal: Frontiers in Psychology, section Language Sciences   Research Topic Title: Scalar Implicatures  Topic Editor(s): Anne Colette Reboul, Penka Stateva  
You can find manuscript guidelines here:   http://home.frontiersin.org/about/author-guidelines  
Abstracts can be submitted directly here:   http://www.frontiersin.org/Language_Sciences/researchtopics/Scalar_Implicatures/6410  

## Experiments

We want to keep the general paradigm constant so that the underlying reasoning about utterances is as similar as possible across tasks, and vary only the dependent measure. 

**General paradigm:** evaluation of the truth of utterances about content of cards

**Measures:** 
- binary (T/F, standard task in SI literature) -- *Is what Bob said true?*
- ternary (F/kinda T/T, similar to Bishop & Katsos 2011) -- *Is what Bob said true?*
- continuous slider (from def. F to def. T) -- *Is what Bob said true?*

**Manipulations (within vs between subjects):**
- scalar item: *some, or* (within or between?)
- content of cards: from Masoud's diss for *or*, analogous conditions for *some* (within)
- dependent measure: binary, ternary, continuous (between)
- speaker knowledge? Bob is either blindfolded and guesses or sees the content of the cards -- either keep constant across both utterances or else manipulate explicitly
- QUD? via cover story make very clear what the point of Bob producing utterances about card content is, or else measure QUD in some way?

## Linking functions

Assume, following Degen & Goodman 2014, that truth-value judgment tasks tap into listeners' speaker models. In RSA terms, this means evaluating probabilities from the production component S1 in some way. In what way? Assume an observed utterance *u* and an observed state of the world (card content) *w*.

### Binary task
```
if p(u|w) > theta
	return T
else 
	return F
```			

### Ternary task
```
if p(u|w) > theta_i
	return T
else if p(u|w) > theta_k
	return kind T
else
	return F
```

### Continuous slider

?? maybe we need to ask something more like "How likely is Bob to describe this situation as 'u'?"

## To do

1. Write up to 1000 words abstract by Oct 31 and submit
2. Make decisions about experiments: 
	- scalar item within or between? 
	- speaker knowledge? 
	- QUD?
3. Set up and run experiments
4. Flesh out linking functions
5. Test linking functions on data and iteratively revise as necessary
