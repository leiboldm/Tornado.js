filenames = ['Tornado.js', 'Lightning.js', 'Person.js', 'Rain.js', 'Destruction.js']
outfile = open('../release/tornado_all.js', 'w')
for filename in filenames:
	fc = open(filename, 'r')
	outfile.write(fc.read())
	fc.close()
outfile.close()
