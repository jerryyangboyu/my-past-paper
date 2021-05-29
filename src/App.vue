<template>
  <el-container class="container100">
    <el-drawer
        title="历史浏览试卷"
        v-model="showHistoryPapers"
        direction="rtl"
        size="36%">
      <el-timeline :reverse="true" v-if="historyPapers.papers">
          <el-timeline-item onclick=""
              v-for="(paper, index) in historyPapers.papers"
              :key="index"
              :timestamp="paper.lastUpdate">
              {{paper.paperURL.split('/').pop()}}
          </el-timeline-item>
      </el-timeline>
    </el-drawer>

    <el-main class="container100">
      <transition name="el-fade-in-linear">
        <el-empty
          class="container100"
          v-if="!showWidget"
          description="选择试卷以浏览Past-Paper"
        ></el-empty>
      </transition>

      <transition name="el-fade-in-linear">
        <div class="container100 paper-container" v-if="showWidget">
          <div class="scalable-aside">
            <iframe
              class="frame left-frame"
              :src="paperURL"
              frameborder="0"
            ></iframe>
            <div class="separator" @mousedown="handleSeparatorMouseDown">
              <i></i><i></i>
            </div>
          </div>
          <transition name="el-fade-in-linear">
            <div class="scalable-main" v-show="showAnswer">
              <iframe
                class="frame right-frame"
                :src="markingURL"
                frameborder="0"
              ></iframe>
            </div>
          </transition>
        </div>
      </transition>
    </el-main>
    <el-footer>
      <el-form :inline="true">
        <el-form-item label="试卷编号">
          <el-cascader
            clearable
            v-model="value"
            :options="options"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>

        <el-form-item label="显示答案" v-show="paperURL !== ''">
          <el-switch
            v-model="showAnswer"
            active-color="#13ce66"
            inactive-color="#ff4949"
          >
          </el-switch>
        </el-form-item>

        <el-form-item label="全屏答案" v-if="showAnswer" v-show="paperURL !== ''">
          <el-switch
              v-model="fullScreenAnswer"
              active-color="#13ce66"
              inactive-color="#ff4949"
          >
          </el-switch>
        </el-form-item>



        <div style="flex: 1; display: flex; justify-content: flex-end">
          <el-form-item>
            <el-button plain icon="el-icon-time" circle @click="showHistoryPapers = !showHistoryPapers"></el-button>
          </el-form-item>

          <el-form-item>
            <el-tooltip effect="dark" :content="`版本：${version}`" placement="top-end">
              <el-button plain icon="el-icon-time" circle></el-button>
            </el-tooltip>
          </el-form-item>
        </div>

      </el-form>
    </el-footer>
  </el-container>
</template>

<script>
export default {
  name: "App",

  data() {
    return {
      // --------Control Variables----------
      version: "v0.0.3 beta",
      prefix: "https://papers.gceguide.com/A%20Levels/",
      showAnswer: true,
      fullScreenAnswer: false,
      value: [],
      showWidget: false,
      paperURL: "",
      markingURL: "",
      historyPapers: {},
      showHistoryPapers: false,

      // -------Pure Data----------
      options: [],
      subjects: [
        {
          alias: "CS(9608)",
          name:
            "Computer%20Science%20(for%20final%20examination%20in%202021)%20(9608)/",
          paperNum: 4,
          yearFrom: 15,
          yearTo: 20,
        },
        {
          alias: "Physics(9702)",
          name: "Physics%20(9702)/",
          paperNum: 5,
          yearFrom: 15,
          yearTo: 20,
        },
        {
          alias: "Further Math(9231)",
          name: "Mathematics%20-%20Further%20(9231)/",
          paperNum: 4,
          yearFrom: 15,
          yearTo: 20,
        },
        {
          alias: "Math(9709)",
          name: "Mathematics%20(9709)/",
          paperNum: 5,
          yearFrom: 15,
          yearTo: 20,
        },
      ],

      startX: 0,
      startWidth: 0,
    };
  },

  watch: {
    showAnswer() {
      if (!this.showAnswer) {
        document.querySelector(".scalable-aside").style.width = "100%";
      } else if (this.showAnswer && this.fullScreenAnswer) {
        document.querySelector(".scalable-aside").style.width = "0%";
      } else {
        document.querySelector(".scalable-aside").style.width = "50%";
      }
    },

    fullScreenAnswer() {
      if(this.showAnswer) {
        if(this.fullScreenAnswer) {
          document.querySelector(".scalable-aside").style.width = "0%";
        } else {
          document.querySelector(".scalable-aside").style.width = "50%";
        }
      }
    }
  },

  methods: {
    handleSeparatorMouseDown(e) {
      this.mouseDown = true;
      this.startX = e.clientX; // integer
      this.startWidth = parseInt(
        window.getComputedStyle(document.querySelector(".scalable-aside"))
          .width,
        10
      ); //string -> int
      document.documentElement.addEventListener(
        "mousemove",
        this.handleSeparatorMouseMove
      );
      document.documentElement.addEventListener(
        "mouseup",
        this.handleSeparatorMouseUp
      );
      console.log("mouse down");
    },
    handleSeparatorMouseMove(e) {
      let newWidth = this.startWidth + e.clientX - this.startX;
      // document.querySelector(".scalable-aside").style.flex = "auto";
      document.querySelector(".scalable-aside").style.width = newWidth + "px";
      if (newWidth / window.innerWidth > .75 && this.showAnswer) {
        document.querySelector(".scalable-aside").style.width = window.innerWidth - 14 + "px";
        this.showAnswer = false;
      }
      console.log("move", newWidth + "px");
    },
    handleSeparatorMouseUp() {
      document.documentElement.removeEventListener("mousemove", this.handleSeparatorMouseMove);
      document.documentElement.removeEventListener("mouseup", this.handleSeparatorMouseUp);
      console.log("up");
    },
    handleChange(value) {
      if (value != null) {
        const subject = value[0];
        const subjectCode = subject.substr(-6, 4);
        const seasonChar = value[1];
        const year = value[2];
        const shortYear = year.substr(2, 2);
        const component = value[3];

        const fullPaperURL = `${this.prefix}${subject}${year}${subjectCode}_${seasonChar}${shortYear}_qp_${component}.pdf`;
        const fullMarkingURL = `${this.prefix}${subject}${year}${subjectCode}_${seasonChar}${shortYear}_ms_${component}.pdf`;

        console.log(value);
        console.log(fullPaperURL);

        this.paperURL = fullPaperURL;
        this.markingURL = fullMarkingURL;

        localStorage.setItem("paperURL", this.paperURL);
        localStorage.setItem("markingURL", this.markingURL);
        localStorage.setItem("paperChoice", this.value);

        // TODO add response detector if 404 then intercept the request and handle error
        this.historyPapers.papers.push({
          paperURL: this.paperURL,
          markingURL: this.markingURL,
          lastUpdate: (new Date()).toLocaleDateString()
        });
        this.historyPapers.lastUpdate = (new Date()).toLocaleDateString();
        localStorage.setItem("historyPapers", JSON.stringify(this.historyPapers));


        this.showWidget = true;
      } else {
        console.log("Has been cleared.");
        this.showWidget = false;
      }
    },

    generateOptionsArray() {
      let subjects = this.subjects;
      let subjectIndex = 0;
      let options = [];

      // subjectIndex,

      function pushSeason() {
        options[subjectIndex].children.push({
          value: "s",
          label: "s",
          children: [],
        });
        options[subjectIndex].children.push({
          value: "w",
          label: "w",
          children: [],
        });
      }

      function pushYear(yearFrom = 1, yearTo = 20) {
        for (let year = 2000 + yearFrom; year <= 2000 + yearTo; year++) {
          options[subjectIndex].children[0].children.push({
            value: `${year}/`,
            label: `${year}`,
            children: [],
          });
          options[subjectIndex].children[1].children.push({
            value: `${year}/`,
            label: `${year}`,
            children: [],
          });
        }
      }

      function pushComponentCode(paperNum, yearFrom = 1, yearTo = 20) {
        for (let i = 0; i <= yearTo - yearFrom; i++) {
          for (let j = 1; j <= paperNum; j++) {
            for (let k = 1; k <= 3; k++) {
              options[subjectIndex].children[0].children[i].children.push({
                value: `${j}${k}`,
                label: `${j}${k}`,
              });
            }
          }
        }

        for (let i = 0; i <= yearTo - yearFrom; i++) {
          for (let j = 1; j <= paperNum; j++) {
            for (let k = 1; k <= 3; k++) {
              options[subjectIndex].children[1].children[i].children.push({
                value: `${j}${k}`,
                label: `${j}${k}`,
              });
            }
          }
        }
      }

      function pushSubject(label, url, paperNum, yearFrom, yearTo) {
        options.push({
          value: url,
          label: label,
          children: [],
        });

        pushSeason();
        pushYear(yearFrom, yearTo);
        pushComponentCode(paperNum, yearFrom, yearTo);
      }

      function pushAll() {
        for (let i = 0; i < subjects.length; i++) {
          const name = subjects[i].alias ? subjects[i].alias : subjects[i].name;
          pushSubject(
            name,
            subjects[i].name,
            subjects[i].paperNum,
            subjects[i].yearFrom,
            subjects[i].yearTo
          );
          subjectIndex++;
        }
      }

      pushAll();

      // console.log(options);

      this.options = options;
    },
  },

  created() {
    // initialise data storage && control variables
    this.generateOptionsArray();
    this.paperURL = localStorage.getItem("paperURL") || "";
    this.markingURL = localStorage.getItem("markingURL") || "";
    if (localStorage.getItem("historyPapers") == null) {
      const initialData = {
        lastUpdate: (new Date()).toLocaleDateString(),
        papers: []
      }
      const serialData = JSON.stringify(initialData);
      console.log(serialData)
      localStorage.setItem("historyPapers", serialData);
    }
    this.historyPapers = JSON.parse(localStorage.getItem("historyPapers"));

    if (this.paperURL !== "" && this.markingURL !== "") {
      this.showWidget = true;
      this.value = localStorage.getItem("paperChoice").split(",");
    }
  },
};
</script>

<style>
#app {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100vh;
  overflow-y: hidden;
}

body {
  margin: 0;
  padding: 0;
}

.frame {
  height: 100%;
}

.left-frame {
  width: 100%;
  overflow-y: hidden;
}
.right-frame {
  width: 100%;
  overflow-y: hidden;
}

.scalable-aside {
  width: 50%;
  position: relative;
}

.scalable-aside .separator {
  position: absolute;
  top: 0;
  right: 0;
  width: 14px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  /* box-shadow: 0px, 0px, 2px, rgba(0, 0, 0, 0.35); */
  cursor: col-resize;
}

.scalable-aside .separator i {
  display: inline-block;
  height: 14px;
  width: 1px;
  background-color: #807373;
  margin: 0 1px;
}

.scalable-main {
  flex: 1;
}

.container100 {
  height: 100%;
  padding: 0 !important;
}

.paper-container {
  display: flex;
}

.el-input {
  width: 15rem !important;
}

.el-form {
  display: flex;
  padding: 0.5rem;
}
</style>