# Generative Models

Course 10 of 20. Covers generative modeling from autoencoders through VAEs, GANs, normalizing flows, and diffusion models.

**In plain words:** this course teaches you how to build models that *make* new data — images,
numbers, tokens — instead of only labelling it. Chapter 1 sets up the big idea: learn the shape
of the data, $p(x)$, then draw new examples from it. Chapters 2–3 squeeze data into short codes
with autoencoders and turn them into a real generator with the VAE's fuzzy codes and ELBO loss.
Chapters 4–6 cover two other routes: GANs, where a forger and an inspector train each other
(including why that game breaks and how WGAN-GP repairs it), and normalizing flows, which give
exact probabilities through reversible steps. Chapters 7–10 build the modern stack — diffusion
models that learn to remove noise, their faster and text-guided versions, latent diffusion, and
token-by-token autoregressive models — and chapter 11 shows how to judge them all fairly with
FID, KID, IS and NLL before the capstone (ch. 12) has you build and compare three models yourself.

## Chapters
1. What "generative" means; likelihood vs implicit
2. Autoencoders and the latent space
3. Variational autoencoders: ELBO, reparameterization
4. GANs: minimax game, training
5. GAN failure modes and fixes (WGAN-GP)
6. Normalizing flows (change of variables)
7. Diffusion models: forward noise, reverse denoise
8. DDPM training and sampling; classifier-free guidance
9. Latent diffusion and conditioning
10. Autoregressive generation (pixels/tokens)
11. Evaluating generative models (FID, IS, NLL)
12. Capstone: VAE + diffusion from scratch
