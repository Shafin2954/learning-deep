# CNNs & Computer Vision

**Prerequisites:** Deep Learning Foundations (autograd, PyTorch training loop, BatchNorm, optimizers).

Twelve chapters covering convolutional networks from the raw math through modern architectures.
Every chapter runs real PyTorch code — no pseudocode.

**In plain words:** this course teaches a computer to see, one building block at a time.
Chapters 1–3 show how a small sliding window of weights (a convolution) turns pixels into
features, and how padding, stride, and pooling control the size of what comes out. Chapters
4–7 stack those blocks into real networks — ResNet's skip connections, BatchNorm and
mobile-friendly blocks — then show how to reuse pretrained networks and stretch a small
dataset with augmentation. Chapters 8–10 move from "what is in the image" to "where is it":
boxes (detection, scored with IoU, NMS and mAP) and per-pixel labels (segmentation with
U-Net and Mask R-CNN). Chapters 11–12 cover Vision Transformers and self-supervised
learning, and the capstone (ch. 13) asks you to build a convolution, a CNN, and a detector or
segmenter largely from scratch.

---

## Part 1 — Convolution Fundamentals (ch. 1–3)

| Ch | Topic |
|----|-------|
| 1 | Convolution & cross-correlation; weight sharing; sparse connectivity |
| 2 | Padding, stride, dilation; receptive field growth |
| 3 | Pooling & downsampling; strided conv vs pooling |

## Part 2 — Architectures (ch. 4–7)

| Ch | Topic |
|----|-------|
| 4 | LeNet → ResNet; skip connections; bottleneck blocks |
| 5 | BatchNorm in CNNs; depthwise separable; squeeze-and-excitation |
| 6 | Transfer learning & fine-tuning; layer-wise LR |
| 7 | Data augmentation: flip/crop/jitter, MixUp, CutMix, RandAugment |

## Part 3 — Detection & Segmentation (ch. 8–10)

| Ch | Topic |
|----|-------|
| 8 | IoU, anchors, NMS — the detection primitives |
| 9 | R-CNN family, YOLO, SSD, DETR |
| 10 | FCN, U-Net, Mask R-CNN, panoptic segmentation |

## Part 4 — Modern Vision (ch. 11–12)

| Ch | Topic |
|----|-------|
| 11 | ViT: patch embedding, class token, Swin, hybrid CNN-ViT |
| 12 | Self-supervised: SimCLR, MoCo, BYOL, MAE, DINO + Under the Trench |

**Capstone:** Conv + detection/segmentation, mostly from scratch.

---

## Study notes

- **●** marks chapters with a runnable Try-it block.
- Chapters 1–3 build the math intuition; chapter 4 connects it to real architectures.
- Chapter 8 implements IoU and NMS from scratch — know this cold.
- Chapter 12's Under the Trench covers NeRF, FPN, pose estimation, video, and more.

## Environment

```
torch torchvision PIL matplotlib numpy
```

Run locally with `docker compose up --build` (runner on :8000) or on the Vercel deployment.
