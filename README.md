# SVM Kernels Tutorial: How Different Kernels Change SVM Behaviour

A visual, hands-on tutorial exploring how **Linear**, **Polynomial**, **RBF (Gaussian)**, and **Sigmoid** kernels transform the classification behaviour of Support Vector Machines.

> **GitHub Repository:** [Insert your GitHub repo link here]

---

## Project Structure

```
muzamilproj/
├── README.md              ← You are here
├── LICENSE                 ← MIT License
├── code/
│   └── svm_kernels_tutorial.ipynb  ← Complete Jupyter Notebook tutorial
├── figures/                        ← All generated plots
│   ├── decision_boundary_*.png
│   ├── kernel_comparison_grid.png
│   ├── gamma_effect.png
│   ├── C_regularization.png
│   ├── polynomial_degree_effect.png
│   ├── accuracy_comparison.png
│   ├── confusion_matrices.png
│   ├── iris_kernels.png
│   ├── circles_comparison.png
│   └── svm_math_intuition.png
└── tutorial/
    ├── index.html          ← Interactive web tutorial (open in browser)
    ├── css/style.css
    ├── js/main.js
    └── figures/            ← Figures used by the webpage
```

## Quick Start

### 1. View the Tutorial

Open `tutorial/index.html` in your web browser — no server needed.

### 2. Run the Jupyter Notebook

```bash
pip install numpy matplotlib scikit-learn seaborn jupyter
cd code
jupyter notebook svm_kernels_tutorial.ipynb
```

All figures will be saved to `figures/` and `tutorial/figures/`.

## Dependencies

| Package       | Version |
|---------------|---------|
| Python        | ≥ 3.8  |
| NumPy         | ≥ 1.21 |
| Matplotlib    | ≥ 3.5  |
| Scikit-learn  | ≥ 1.0  |
| Seaborn       | ≥ 0.12 |

## Tutorial Contents

1. **What is an SVM?** — Hyperplanes, margins, and support vectors
2. **The Kernel Trick** — How kernels enable non-linear classification
3. **Four Kernels Compared** — Linear, Polynomial, RBF, and Sigmoid on synthetic data
4. **Parameter Tuning** — Gamma, C, and polynomial degree effects visualised
5. **Quantitative Results** — Accuracy, confusion matrices, and classification reports
6. **Real-World Application** — Iris dataset kernel comparison
7. **Ethical Considerations** — Bias, interpretability, and privacy

## Accessibility

- **Colour-blind friendly** palette (Tol Bright scheme) used throughout all figures
- **Semantic HTML** with ARIA labels and skip navigation
- **Responsive design** that works on mobile and desktop
- **Prefers-reduced-motion** support: all animations are disabled for users who prefer reduced motion

## References

1. Cortes, C. & Vapnik, V. (1995). Support-vector networks. *Machine Learning*, 20(3), 273–297.
2. Boser, B. E., Guyon, I. M. & Vapnik, V. N. (1992). A training algorithm for optimal margin classifiers. *COLT '92*.
3. Schölkopf, B. & Smola, A. J. (2002). *Learning with Kernels*. MIT Press.
4. Hsu, C.-W., Chang, C.-C. & Lin, C.-J. (2003). A practical guide to support vector classification.
5. Scikit-learn documentation: https://scikit-learn.org/stable/modules/svm.html
6. Raschka, S. (2015). *Python Machine Learning*. Packt Publishing.
7. Pedregosa, F. et al. (2011). Scikit-learn: Machine Learning in Python. *JMLR*, 12, 2825–2830.

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
