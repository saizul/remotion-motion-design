// Splits a group photo into one transparent PNG per person using Vision instance masks (macOS 14+).
// Usage: swift scripts/cutout-people.swift <input> <outDir>
import AppKit
import CoreImage
import Vision

let args = CommandLine.arguments
guard args.count == 3, let input = CIImage(contentsOf: URL(fileURLWithPath: args[1])) else {
    fatalError("usage: cutout-people.swift <input> <outDir>")
}
let request = VNGenerateForegroundInstanceMaskRequest()
let handler = VNImageRequestHandler(ciImage: input)
try handler.perform([request])
guard let result = request.results?.first else { fatalError("no subjects found") }
let context = CIContext()
print("instances:", result.allInstances.count)
for instance in result.allInstances {
    let mask = try result.generateScaledMaskForImage(forInstances: IndexSet(integer: instance), from: handler)
    let output = input.applyingFilter("CIBlendWithMask", parameters: [
        kCIInputBackgroundImageKey: CIImage.empty(),
        kCIInputMaskImageKey: CIImage(cvPixelBuffer: mask),
    ])
    let url = URL(fileURLWithPath: args[2]).appendingPathComponent("instance-\(instance).png")
    try context.writePNGRepresentation(of: output, to: url, format: .RGBA8, colorSpace: CGColorSpaceCreateDeviceRGB())
}
