import sys

infile = open(sys.argv[1], 'r')
output = bytearray()
curbyte = infile.read(2)
while curbyte != "":
  output.append(int(curbyte, 16))
  curbyte = infile.read(2)
infile.close()
outfile = open(sys.argv[2], 'wb')
outfile.write(output)
outfile.close()