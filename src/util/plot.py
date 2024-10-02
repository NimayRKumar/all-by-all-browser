import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import matplotlib.pyplot as plt
import pdb
import numpy as np

data = '/Users/nimay/Desktop/gwas_results/MVP_R4.1000G_AGR.Phe_394.EUR.GIA.dbGaP.txt'
chrom_pos = []
logp = []
tick_vals = [0] * 23
tick_labels = [f'chr-{c}' for c in range(1, 24)]

df = pd.read_csv(data, delimiter='\t')
df = df.loc[df['pval'] > 5e-8]

for chr in range(1, 24):
    df_chr = df.loc[df['chrom'] == chr]
    if (not df_chr.empty):
        df_chr.sort_values(by=['pos'])
        log_p = -np.log10(df_chr['pval'])

        tick_vals[chr - 1] = len(logp)
        logp.extend(log_p.tolist())
        chrom_pos.extend(df_chr['pos'].tolist())


index_pos = range(0, len(logp))

ax = plt.axes()
plt.xticks(rotation=90)

ax.set_xticks(tick_vals)
ax.set_xticklabels(tick_labels)

plt.scatter(x=index_pos, y=logp)
plt.savefig('./EUR_test.png')