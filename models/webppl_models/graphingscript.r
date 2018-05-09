library(rwebppl)
library(tidyverse)
library(ggthemes)
library(plyr)

states = c("X", "X,Y");
utterances = c('X', 'XorY', 'XandY', 'Z');

f <- data.frame(utterance=character(),
                state=character(), 
                prob=integer(), 
                stringsAsFactors=FALSE) 

for (state in states){
  for (utt in utterances){
    d <- data.frame(u=character(),s=character())
    d <- rbind(d, data.frame(s = state, u = utt))
    f <- rbind(f, data.frame(s = state, u = utt, prob = webppl(program_file = "code_forgraphs.webppl", data = d, data_var = "input")))
  }
}

f$s <- revalue(f$s, c("X"="s = Cat on card", "X,Y"="s = Cat and dog on card"))
f$u <- revalue(f$u, c("X"="u = 'Cat'", "XorY" = "u = 'Cat or dog'", "XandY" = "u = 'Cat and dog'", "Z" = "u = 'Elephant'"))

f %>%
  ggplot(aes(x=u, y=prob)) +
  geom_bar(stat = "identity", position="dodge", width = 0.6) +
  facet_wrap(~s) +
  labs(x="", y="RSA speaker probability S(u|s)")+
  theme_few() +
  theme(text = element_text(size=12), axis.text.x = element_text(angle = 45, hjust = 1))
  scale_fill_manual(values = c("red4", "springgreen3"), guide=FALSE) 

