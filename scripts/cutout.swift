// Removes the background from a portrait using Apple's Vision subject mask (macOS 14+).
// Usage: swift scripts/cutout.swift <input.jpg> <output.png>
import AppKit
import CoreImage
import Vision

let args = CommandLine.arguments
guard args.count == 3, let input = CIImage(contentsOf: URL(fileURLWithPath: args[1])) else {
    fatalError("usage: cutout.swift <input> <output.png>")
}
let request = VNGenerateForegroundInstanceMaskRequest()
let handler = VNImageRequestHandler(ciImage: input)
try handler.perform([request])
guard let result = request.results?.first else { fatalError("no subject found") }
let mask = try result.generateScaledMaskForImage(forInstances: result.allInstances, from: handler)
let maskImage = CIImage(cvPixelBuffer: mask)
let output = input.applyingFilter("CIBlendWithMask", parameters: [
    kCIInputBackgroundImageKey: CIImage.empty(),
    kCIInputMaskImageKey: maskImage,
])
let context = CIContext()
try context.writePNGRepresentation(of: output, to: URL(fileURLWithPath: args[2]), format: .RGBA8, colorSpace: CGColorSpaceCreateDeviceRGB())
print("ok", args[2])
