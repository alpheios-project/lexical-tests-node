#!/usr/bin/perl
# takes as input a file containing a list of words to run through the test
# and produces the JSON structure needed as input
# the file should contain oen word per line
# Usage: makejson.pl file langcode [shortdictcode,fulldictcode]
# E.g. to create an input file for a list of persian words that will test the 
# Steingass dictionary for full and short definitions
# E.g. makejson.pl input.txt per [stg,stg]
use strict;

my $file = $ARGV[0];
my $lang = $ARGV[1];
my ($short,$full) = split /,/, $ARGV[2];

die "Usage: $0 inputfile langcode [shortdictcode,fulldictcode]\n" unless $file && $lang;
open FILE, "<$file" or die $!;

my @words;
while (<FILE>) {
   chomp;
   my $word = $_;
   $word =~ s/\r\n/\n/;
   if ($word) {
     push @words, <<EOS;
{
  "targetWord": "$word",
  "languageCode": "$lang",
  "lexiconShortOpts": {"codes":[@{[$short ? qq!"$short"! : ()]}]},
  "lexiconFullOpts": {"codes":[@{[$full ? qq!"$full"! : ()]}]}
}
EOS
  }
}
print <<"EOS";
{
   "queue_max": 3,
   "data": [
EOS
  
print join ",\n", @words;
print <<"EOS";
  ]
}
EOS


