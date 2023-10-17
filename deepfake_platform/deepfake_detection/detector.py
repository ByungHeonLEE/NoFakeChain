import torch
from . import train_spectrum, module_spectrum, radialProfile

# Load pre-trained models (assuming you have saved weights as 'generator_weights.pth' and 'discriminator_weights.pth')
# G = module_spectrum.ConvGenerator(args.z_dim, shape[-1], n_upsamplings=n_G_upsamplings).to(device)
# D = module_spectrum.ConvDiscriminator(shape[-1], n_D_downsamplings=n_D_downsamplings, norm=d_norm).to(device)
# G.load_state_dict(torch.load('generator_weights.pth'))
# D.load_state_dict(torch.load('discriminator_weights.pth'))


def is_deepfake(video_path):
    # Convert video to frames
    frames = video_to_frames(video_path)

    fake_count = 0
    for frame in frames:
        # Convert frame to tensor
        frame_tensor = transform(frame).unsqueeze(0).to(device)

        # Check if frame is fake
        with torch.no_grad():
            d_logit = D(frame_tensor)
            if d_logit.item() < 0.5:  # Assuming threshold is 0.5
                fake_count += 1

    # If more than half of the frames are detected as fake, classify video as deepfake
    return fake_count > len(frames) / 2
