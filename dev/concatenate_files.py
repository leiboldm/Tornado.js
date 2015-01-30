filenames = ['Tornado.js', 'Lightning.js', 'Person.js', 'Rain.js', 'Destruction.js']
with open('../release/tornado_all.js', 'w') as outfile:
    for line in itertools.chain.from_iterable(itertools.imap(open, filnames)):
        outfile.write(line)