// ts直接导入js库会有问题，需要.d.ts的声明文件，一般是@types/
// 注意安装时npm install '@types/' 要用''包裹，不然不识别@符号
import superAgent from 'superagent';
import cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import DellAnalyzer from './analyzer';

export interface Analyzer {
  analyze: (html: string, filePath: string) => string;
}

class Crawler {
  // private secret = 'secretKey'; // 该值有可能会随着typescript课程变化
  // // 如果``分行的话，superagent就会报错
  // private url = `http://www.dell-lee.com/typescript/demo.html?secret=${this.secret}`;
  constructor(private url: string, private analyzer: Analyzer) {
    this.initSpiderProcess();
  }
  private filePath = path.resolve(__dirname, '../../data/course.json');
  private rawHtml = ''; // 存放抓取下来的HTML内容
  private async getRawHtml() {
    const result = await superAgent.get(this.url);
    return result.text;
  }
  private async initSpiderProcess() {
    // 控制爬虫的运行
    const html = await this.getRawHtml();
    const fileContent = this.analyzer.analyze(html, this.filePath);
    this.writeFile(fileContent);
  }
  private writeFile(content: string) {
    fs.writeFileSync(this.filePath, content);
  }
}

export default Crawler;

const secret = 'secretKey';
const url = `http://www.dell-lee.com/typescript/demo.html?secret=${secret}`;
// analyzer单例模式
// const analyzer = DellAnalyzer.getInstance();
// const crawler = new Crawler(url, analyzer);
// console.log('hahaha');
