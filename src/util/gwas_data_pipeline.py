import os
import json
import base64
from io import BytesIO
from PIL import Image
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import plotly.express as px
import plotly.io as pio


thresh = -np.log10(5e-8)
qq_data = {}


def mkdirs(path):
    if not os.path.isdir(path):
        os.makedirs(path)


def format_gwas_for_plot(chr, df):
    return {
        'x': df['pos'].tolist(),
        'y': df['logp'].tolist(),
        'chr': chr
    }


def make_comp_qq(outdir):
    for pheno in qq_data.keys():
        plt.figure()
        plt.xlabel('Observed Values')
        plt.ylabel('Theoretical Values')
        plt.axline((0, 0), slope=1)

        for cohort in qq_data[pheno].keys():
            data = qq_data[pheno][cohort]
            plt.scatter(x=data['x'], y=data['y'], label=cohort)
        
        ax = plt.gca()
        lim_max = max(ax.get_xlim()[1], ax.get_ylim()[1])
        plt.xlim(right=lim_max)
        plt.ylim(top=lim_max)

        plt.legend(loc="upper left")
        plt.savefig(f'{outdir}/{pheno}/qq_comp.png', dpi=600)
        plt.clf()


def make_ind_qq(y, outdir, pheno, cohort):
    n = y.size
    y.sort()
    x = -np.log10(np.linspace(1, 1/n, num=n))
    x.sort()

    data_dict = {'x': x.tolist(), 'y': y.tolist()}

    if (pheno in qq_data):
        qq_data[pheno][cohort] = data_dict
    else:
        qq_data[pheno] = {cohort: data_dict}

    with open(f"{outdir}{pheno}/{cohort}/qq.JSON", 'w') as f:
        json.dump(data_dict, f)
    

    plt.scatter(x=x, y=y)
    ax = plt.gca()
    lim_max = max(ax.get_xlim()[1], ax.get_ylim()[1])
    plt.xlim(right=lim_max)
    plt.ylim(top=lim_max)
    plt.axline((0, 0), slope=1)
    plt.xlabel('Observed Values')
    plt.ylabel('Theoretical Values')
    plt.savefig(f'{outdir}/{pheno}/{cohort}/qq.png', dpi=600)
    plt.clf()


def make_manhattan(df, outdir):
    def map_chrom_to_color(chrom):
        idx = chrom % 2
        return COLORS[idx]

    def map_chrom_to_xoffset(chrom):
        return tick_vals[str(chrom)]

    def get_arr_from_enums(obj):
        arr = []
        for key in obj.keys():
            arr.append(str(obj[key]))

        return arr

    with open('./enums.JSON') as f:
        enums = json.load(f)

    THRESHOLD = enums['THRESHOLD']
    COLORS = enums['COLORS']
    tick_vals = enums['GRC38_P14_CHROMOSOME_LENGTHS_CUMULATIVE_SUMS']
    norm_factor = tick_vals['23'] + enums['GRC38_P14_CHROMOSOME_LENGTHS']['23']

    df_dyn = df.query('pval <= @THRESHOLD')
    df_stat = df.query('pval > @THRESHOLD')

    df_smp = df_stat.groupby('chrom').sample(n=250000)
    df_data = pd.concat([df_smp, df_dyn])
    df_data['color'] = df_data['chrom'].apply(map_chrom_to_color)
    df_data['xpos'] = (df_data['pos'] + df_data['chrom'].apply(map_chrom_to_xoffset)) / norm_factor

    fig = px.scatter(df_data, x='xpos', y='logp', color='color', labels={'xpos': '', 'logp': ''})
    fig.update_layout(
        showlegend=False,
        plot_bgcolor='rgba(0, 0, 0, 0)',
        paper_bgcolor='rgba(0, 0, 0, 0)',
        margin=dict(l=0, r=0, b=0, t=0),
    )

    fig.update_traces(marker=dict(size=5))
    fig.update_xaxes(showticklabels=False, range=[0, 1], constrain='domain', showgrid=False)
    fig.update_yaxes(showticklabels=False, range=[0, 10], constrain='domain', showgrid=False)

    df_dyn = df_data.query('pval <= @THRESHOLD')
    df_dyn_even = df_dyn.query('(chrom % 2) == 0')
    df_dyn_odd = df_dyn.query('(chrom % 2) == 1')

    data = {
        'norm_factor': norm_factor,
        'tick_vals': get_arr_from_enums(tick_vals),
        'even': {
            'x': df_dyn_even['xpos'].tolist(),
            'y': df_dyn_even['logp'].tolist(),
            'pval': df_dyn_even['pval'].tolist(),
            'chrom': df_dyn_even['chrom'].tolist(),
        },
        'odd': {
            'x': df_dyn_odd['xpos'].tolist(),
            'y': df_dyn_odd['logp'].tolist(),
            'pval': df_dyn_odd['pval'].tolist(),
            'chrom': df_dyn_odd['chrom'].tolist(),
        }
    }

    with open(f'{outdir}/data.json', mode='w') as d:
        json.dump(data, d)
    d.close()

    img = pio.to_image(fig, scale=2.0, width=900, height=600)
    img64 = base64.b64encode(img).decode('utf-8')
    imgb = base64.b64decode(img64)

    image_obj = Image.open(BytesIO(imgb))
    img_flipped = image_obj.transpose(Image.FLIP_TOP_BOTTOM)

    buffered = BytesIO()
    img_flipped.save(f'{outdir}/flipped_man.png', format='png')
    image_obj.save(f'{outdir}/man.png', format='png')
    img_flipped.save(buffered, format='png')
    img_flipped64 = base64.b64encode(buffered.getvalue()).decode('utf-8')

    with open(f'{outdir}/img.json', mode='w') as i:
        json.dump({"src": img64, "src_flipped": img_flipped64}, i)

    i.close()


def gwas(indir, outdir, file):
    file_split = file.split('.')
    pheno = file_split[2]
    cohort = file_split[3]

    mkdirs(f'{outdir}/{pheno}')
    mkdirs(f'{outdir}/{pheno}/{cohort}')

    df = pd.read_csv(f'{indir}/{file}', delimiter='\t',index_col=False)
    df['logp'] = -np.log10(df['pval'])
    
    make_manhattan(df[['chrom', 'pos', 'pval', 'logp']], f'{outdir}/{pheno}/{cohort}')
    make_ind_qq(df['logp'].to_numpy().copy(), outdir, pheno, cohort)

    table_df = df.query('pval <= 10e-6')
    table_df.to_json(f'{outdir}/{pheno}/{cohort}/table.json', orient='records')


def handle_metadata(indir, file):
    tb = pd.read_csv(f'{indir}/{file}', delimiter='\t')
    return tb.to_dict(orient='records')


def main():
    indir = '/Users/nimay/Desktop/gwas_results/'
    outdir = '/Users/nimay/Desktop/all-by-all-browser/src/data/gwas/'
    phenos = {}

    for file in os.listdir(indir):
        if (not file.endswith('.txt')):
            continue

        f_split = file.split('.')
    
        pheno = f_split[2]
        coh = f_split[3]

        if (f_split[6] == 'metadata'):
            metadata = handle_metadata(indir, file)
            if pheno not in phenos:
                phenos[pheno] = {'metadata': {coh: metadata}, 'cohorts': []}
            else:
                phenos[pheno]['metadata'][coh] = metadata
        else:
            if pheno not in phenos:
                phenos[pheno] = {'cohorts': [coh], 'metadata': {}}
            elif coh not in phenos[pheno]['cohorts']:
                phenos[pheno]['cohorts'].append(coh)

            gwas(indir, outdir, file)
    
    with open(f'{outdir}/meta.json', 'w') as p:
        json.dump(phenos, p)

    make_comp_qq(outdir)


if __name__ == '__main__':  
    main()